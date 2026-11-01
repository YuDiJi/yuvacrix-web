/* Focused offline regression checks using Node and the installed TypeScript compiler. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
let assertions = 0;
function check(value, message) { assert.ok(value, message); assertions++; }
function equal(actual, expected, message) { assert.equal(JSON.stringify(actual), JSON.stringify(expected), message); assertions++; }
function load(file, mocks = {}, append = "") {
  const exports = {};
  const source = fs.readFileSync(path.join(root, file), "utf8") + append;
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
  const baseApi = { injectEndpoints: ({ endpoints }) => ({ endpoints: endpoints({ query: (x) => x, mutation: (x) => x }) }) };
  const localRequire = (name) => {
    if (name in mocks) return mocks[name];
    if (name === "../baseApi") return { baseApi };
    if (name.startsWith("@/") || name.startsWith("./") || name.startsWith("next/")) return {};
    return require(name);
  };
  vm.runInNewContext(code, { exports, require: localRequire, console, Set, FormData: class { get() { return ""; } } }, { filename: file });
  return exports;
}
const helpers = load("src/components/cricket/tournament/playoffs.ts");
const mixed = "GROUP_STAGE_PLUS_KNOCKOUT";
for (const option of helpers.PLAYOFF_OPTIONS) {
  const config = option.config;
  equal(helpers.playoffConfig(config.playoffStructure), config, "Exact count/structure pair");
  check(helpers.validPlayoffConfig(config), "Valid configuration");
  equal(helpers.tournamentFormatFields(true, mixed, config.playoffStructure), { format: mixed, formatConfig: config }, "Mixed format payload");
  equal(helpers.tournamentFormatFields(false, mixed, config.playoffStructure), {}, "Locked edit omits format/config");
  equal(helpers.playoffPreview(config, []), [], "Insufficient standings do not invent teams");
}
check(!helpers.validPlayoffConfig(null), "Legacy configuration stays absent");
check(!helpers.validPlayoffConfig({ qualifyingTeamCount: 2, playoffStructure: "TOP_3_FIRST_TO_FINAL" }), "Reject inconsistent pair");
for (const format of ["LEAGUE", "KNOCKOUT", "GROUP_STAGE", "CUSTOM"]) equal(helpers.tournamentFormatFields(true, format, "TOP_3_FIRST_TO_FINAL"), { format }, "Other formats omit config");
const configs = helpers.PLAYOFF_OPTIONS.map((x) => x.config);
equal(helpers.playoffPreview(configs[0], ["A", "B"]), ["Final: A vs B"], "Top 2 preview");
equal(helpers.playoffPreview(configs[1], ["A", "B", "C"]), ["Semifinal: B vs C", "Final: A (Direct Bye) vs Winner of Semifinal"], "Top 3 preview");
equal(helpers.playoffPreview(configs[2], ["A", "B", "C", "D"]), ["Semifinal 1: A vs D", "Semifinal 2: B vs C", "Final: Winners of Semifinals"], "Top 4 preview");
equal([0, 1, 2, 3].map((i) => helpers.qualificationLabel(configs[1], i)), ["Final (Direct Bye)", "Semifinal", "Semifinal", null], "Qualification badges");
equal(helpers.playoffGenerationBody(false, { oversLimit: "10" }), {}, "Inherited rules omit overrides");
equal(helpers.playoffGenerationBody(true, {}), {}, "Empty overrides omitted");
equal(helpers.playoffGenerationBody(true, { oversLimit: "20", oversPerBowler: "4", city: " Pune ", pitchType: "ROUGH" }), { rulesOverrides: { oversLimit: 20, oversPerBowler: 4, venue: { city: "Pune", pitchType: "ROUGH" } } }, "Only supplied overrides sent");
for (const fields of [{ oversLimit: "0" }, { oversLimit: "1.5" }, { oversLimit: "NaN" }, { oversLimit: "201" }, { oversPerBowler: "51" }, { oversLimit: "2", oversPerBowler: "3" }, { pitchType: "INVALID" }]) {
  assert.throws(() => helpers.playoffGenerationBody(true, fields)); assertions++;
}
check(!helpers.hasLinkedMatch({ teamAId: "a", teamBId: "b", matchId: null }), "Resolved teams without a match cannot play");
check(!helpers.hasLinkedMatch({ teamAId: "a", teamBId: null, matchId: "m" }), "Unresolved fixture cannot play");
check(helpers.hasLinkedMatch({ teamAId: "a", teamBId: "b", matchId: "m" }), "Linked resolved fixture playable");
for (const code of ["QUALIFYING_STAGE_NOT_COMPLETED", "NOT_ENOUGH_QUALIFIED_TEAMS", "KNOCKOUT_BRACKET_UNSUPPORTED_FOR_FORMAT", "ONE_OR_MORE_SEEDS_NOT_ACTIVE_IN_TOURNAMENT", "TOURNAMENT_FORMAT_LOCKED_BY_FIXTURES", "FORMAT_CONFIG_REQUIRED", "FORMAT_CONFIG_INCONSISTENT"]) {
  const nested = helpers.tournamentPlayoffError({ data: { message: code } });
  check(nested !== code, `Friendly Nest error: ${code}`);
  equal(helpers.tournamentPlayoffError({ data: { code } }), nested, "Code and message error shapes");
}
check(helpers.tournamentPlayoffError({ status: 403 }).includes("permission"), "Forbidden message");
equal(helpers.tournamentPlayoffError({ data: { message: "Server detail" } }), "Server detail", "Unknown server messages preserved");
const formFile = "src/components/cricket/tournament/TournamentForm.tsx";
const form = load(formFile, { "./playoffs": helpers }, "\nexport { schema, EMPTY_FORM_VALUES, tournamentToFormValues };\n");
for (const config of configs) equal(form.tournamentToFormValues({ format: mixed, formatConfig: config }).playoffStructure, config.playoffStructure, "Edit hydration");
equal(form.tournamentToFormValues({ format: mixed }).playoffStructure, "", "No invented legacy configuration");
check(/setValue\(\s*"playoffStructure",\s*"TOP_3_FIRST_TO_FINAL",?\s*\)/.test(fs.readFileSync(path.join(root, formFile), "utf8")), "New mixed format defaults Top 3");
const points = load("src/store/api/cricket/tournamentPointsApi.ts");
const row = { teamId: "b", teamNameSnapshot: "B", played: 1, won: 1, lost: 0, tied: 0, noResult: 0, points: 2, netRunRate: 0.5 };
for (const response of [null, {}, { rows: null }, { rows: "bad" }, { rows: [null] }, { rows: [2] }, { rows: [{ ...row, netRunRate: undefined }] }, { rows: [{ ...row, netRunRate: NaN }] }]) {
  const normalized = points.normalizeTournamentPointsTable(response);
  equal(normalized.rows, [], "Invalid standings safely empty"); check(normalized.validationError, "Invalid standings explicit error");
}
equal(points.normalizeTournamentPointsTable({ rows: [] }).rows, [], "Valid empty standings");
const normalized = points.normalizeTournamentPointsTable({ rows: [row, { ...row, teamId: "a", teamNameSnapshot: "A" }] });
equal(normalized.rows.map((x) => x.teamId), ["b", "a"], "Preserve authoritative ranking order");
equal(normalized.rows[0].nrr, 0.5, "NRR normalization");
equal(points.tournamentPointsApi.endpoints.getTournamentPointsTable.query({ tournamentId: "t" }).url, "/tournaments/t/points-table", "Points endpoint");
const fixtureApi = load("src/store/api/cricket/tournamentFixtureApi.ts").tournamentFixtureApi.endpoints;
equal(fixtureApi.generateKnockoutFixtures.query({ tournamentId: "t", body: {} }), { url: "/tournaments/t/fixtures/knockout/generate", method: "POST", body: {} }, "Generation endpoint without seeds");
const tags = fixtureApi.generateKnockoutFixtures.invalidatesTags([], undefined, { tournamentId: "t" });
for (const type of ["Tournament", "TournamentFixture", "TournamentMatch", "TournamentRound", "TournamentPointsTable"]) check(tags.some((tag) => tag.type === type), `Generation invalidates ${type}`);
equal(fixtureApi.generateKnockoutFixtures.invalidatesTags(undefined, { status: 400 }, { tournamentId: "t" }), [], "Failed generation does not refetch every query");
const list = fs.readFileSync(path.join(root, "src/app/(app)/tournaments/[tournamentId]/_components/TournamentMatchList.tsx"), "utf8");
check(!list.includes("pollingInterval"), "No automatic matches polling");
check(list.includes("filter: activeTab"), "Filters select the correct query");
check(list.includes('if (showUpcoming) setActiveTab("UPCOMING")'), "Generation reveals upcoming matches");
for (const name of ["getMatchRoute", "setSelectedMatchContext", "handleMatchClick"]) check(new RegExp(`function ${name}[^]*?if \\(!match\\.matchId\\?\\.trim\\(\\)\\)`).test(list), `Guard ${name}`);

async function main() {
  let formValues;
  let canEditFormat;
  let savedBody;
  let validation;
  const submitForm = load(formFile, {
    "./playoffs": helpers,
    react: { useEffect() {}, useState: (value) => [value, () => {}] },
    "next/navigation": { useRouter: () => ({ push() {} }) },
    "@/components/common/Button": { Button: "button" },
    "@/components/common/ImageUploaderV1": { ImageUploader: "image-uploader" },
    "@/store/api/uploadApi": { useUploadFileMutation: () => [() => {}, { isLoading: false }] },
    "@/store/api/cricket/tournamentApi": {
      useGetAboutQuery: () => ({ data: { actions: { canEditFormat } } }),
      useCreateTournamentMutation: () => [(body) => { savedBody = body; return { unwrap: async () => ({ id: "t" }) }; }, {}],
      useUpdateTournamentMutation: () => [({ body }) => { savedBody = body; return { unwrap: async () => ({ id: "t" }) }; }, {}],
    },
    "react-hook-form": {
      Controller: "controller",
      useForm: () => ({ control: {}, handleSubmit: (callback) => () => callback(formValues), reset() {}, watch: (name) => formValues[name], setValue() {}, setError: (name) => { validation = name; }, formState: { errors: {} } }),
    },
  });
  const validValues = { ...form.EMPTY_FORM_VALUES, name: "Cup", city: "Pune", startDate: "2026-10-30", endDate: "2026-10-31", format: mixed };
  for (const config of configs) {
    formValues = { ...validValues, playoffStructure: config.playoffStructure };
    savedBody = undefined;
    const rendered = submitForm.default({});
    await rendered.props.children.props.onSubmit();
    equal(savedBody.formatConfig, config, "Actual create handler sends exact config");
  }
  formValues = { ...validValues, playoffStructure: "" };
  savedBody = validation = undefined;
  await submitForm.default({}).props.children.props.onSubmit();
  equal(validation, "playoffStructure", "Missing config validation shown");
  equal(savedBody, undefined, "Missing config does not submit");
  for (canEditFormat of [false, undefined]) {
    savedBody = undefined;
    await submitForm.default({ mode: "EDIT", tournamentId: "t", tournament: {} }).props.children.props.onSubmit();
    check(savedBody && !("format" in savedBody) && !("formatConfig" in savedBody), "Locked/missing permission still permits metadata-only update");
  }
  for (const format of ["LEAGUE", "KNOCKOUT", "GROUP_STAGE", "CUSTOM"]) {
    formValues = { ...validValues, format, playoffStructure: "TOP_3_FIRST_TO_FINAL" };
    savedBody = undefined;
    await submitForm.default({}).props.children.props.onSubmit();
    check(savedBody.format === format && !("formatConfig" in savedBody), "Actual non-mixed form payload excludes config");
  }
  const requests = [];
  const result = await fixtureApi.getTournamentPlayoffFixtures.queryFn("t", {}, {}, async (request) => {
    requests.push(request.params.skip);
    return { data: request.params.skip === 0 ? [{ id: "league" }] : [] };
  });
  equal(requests, [0, 1], "Read all fixture pages until empty, even if backend caps the page");
  equal(result.data.map((x) => x.id), ["league"], "Complete fixture state");
  const repeated = await fixtureApi.getTournamentPlayoffFixtures.queryFn("t", {}, {}, async () => ({ data: [{ id: "same" }] }));
  check(repeated.error, "Repeated pages fail safely instead of looping");
  const setupFile = "src/components/cricket/tournament/TournamentPlayoffs.tsx";
  let callCount = 0;
  let rejectRequest;
  let resolveRequest;
  let generated = 0;
  let lastError;
  const standings = { currentData: normalized, isFetching: false, isError: false };
  const fixtureMocks = {
    useGetTournamentPlayoffFixturesQuery: () => fixtureState,
    useGenerateKnockoutFixturesMutation: () => [(request) => {
      callCount++;
      equal(request.body, {}, "UI generation uses standings, never manual seeds");
      return { unwrap: () => new Promise((resolve, reject) => { rejectRequest = reject; resolveRequest = resolve; }) };
    }, { isLoading: false }],
  };
  let fixtureState = { currentData: [{ id: "league", roundId: "r", status: "COMPLETED" }], isFetching: false, isError: false };
  const roundState = { currentData: [{ id: "r", roundType: "LEAGUE" }], isFetching: false, isError: false };
  const component = load(setupFile, {
    react: { useRef: (value) => ({ current: value }), useState: (value) => [value, (next) => { lastError = next; }] },
    "@/components/common/DialogBox": { DialogBox: "dialog" },
    "@/components/common/Button": { Button: "button" },
    "next/navigation": { useRouter: () => ({ push() {} }) },
    "@/store/api/cricket/tournamentRoundApi": { useGetTournamentRoundsQuery: () => roundState },
    "./playoffs": helpers,
    "@/store/api/cricket/tournamentPointsApi": { useGetTournamentPointsTableQuery: () => standings },
    "@/store/api/cricket/tournamentFixtureApi": fixtureMocks,
  }, "\nexport { PlayoffSetup };\n");
  const tournament = { id: "t", format: mixed, formatConfig: configs[1], isAdmin: true, status: "ACTIVE" };
  const playoffView = () => JSON.stringify(component.default({ tournament, showBracket: true, onGenerated() {} }));
  check(playoffView().includes("Generate Playoff Bracket"), "Completed qualifying fixtures enable organizer generation");
  equal(callCount, 0, "Rendering never automatically generates a bracket");
  fixtureState.currentData[0].status = "SCHEDULED";
  check(!playoffView().includes("Generate Playoff Bracket"), "Pending league fixture blocks readiness");
  fixtureState.currentData[0].status = "COMPLETED";
  roundState.currentData.push({ id: "semi", roundType: "SEMI_FINAL" });
  check(!playoffView().includes("Generate Playoff Bracket"), "Existing manual playoff rounds preserved without duplicate generation");
  roundState.currentData.push({ id: "final", roundType: "FINAL" });
  fixtureState.currentData.push({ id: "f", roundId: "final", status: "DRAFT", teamAId: "a", teamBId: null, matchId: null, teamBSourceFixtureId: "semi", teamASnapshot: { name: "A" } });
  const pendingBracket = playoffView();
  check(pendingBracket.includes("Winner of Semifinal (TBD)"), "Unresolved final has meaningful source label");
  check(pendingBracket.includes("Seeded #1 (Bye)"), "Top 3 seeded final team has bye badge");
  check(!pendingBracket.includes("Scorecard"), "Unresolved final has no match navigation");
  tournament.isAdmin = false;
  check(!playoffView().includes("Generate Playoff Bracket"), "Viewers cannot generate");
  function renderSetup(config = configs[0]) {
    return component.PlayoffSetup({ tournament: { id: "t", formatConfig: config }, onClose() {}, onGenerated() { generated++; } });
  }
  const originalData = standings.currentData;
  standings.isFetching = true;
  check(JSON.stringify(renderSetup()).includes("Loading standings"), "Standings loading state");
  standings.isFetching = false;
  standings.isError = true;
  check(JSON.stringify(renderSetup()).includes("Unable to load standings"), "Standings error state");
  standings.isError = false;
  standings.currentData = { rows: [] };
  check(JSON.stringify(renderSetup()).includes("No ranked teams"), "Standings empty state");
  standings.currentData = originalData;
  check(JSON.stringify(renderSetup(configs[1])).includes("not enough ranked teams"), "Insufficient teams state");
  standings.currentData = { rows: [], validationError: "Invalid ranking" };
  check(JSON.stringify(renderSetup()).includes("Invalid ranking"), "Malformed standings state");
  standings.currentData = originalData;
  const tree = component.PlayoffSetup({ tournament: { id: "t", formatConfig: configs[0] }, onClose() {}, onGenerated() { generated++; } });
  const submit = tree.props.children.props.onSubmit;
  const event = { preventDefault() {}, currentTarget: {} };
  const first = submit(event);
  await submit(event);
  equal(callCount, 1, "Repeated confirmation while in flight makes one request");
  rejectRequest({ data: { message: "QUALIFYING_STAGE_NOT_COMPLETED" } });
  await first;
  check(lastError.includes("qualifying"), "Generation error displayed");
  const retry = submit(event);
  equal(callCount, 2, "Failed generation permits organizer retry");
  resolveRequest([]);
  await retry;
  equal(generated, 1, "Success callback runs once");
  console.log(`Tournament playoff checks passed (${assertions} assertions). No network requests made.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
