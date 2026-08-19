import { Stats } from "@/components/cricket/stats/page";
import { CricketProfile } from "@/types/cricket/cricketProfile";
import React from "react";

type MatchesTabProps = {
  profile: CricketProfile;
};

const StatsTab = ({ profile }: MatchesTabProps) => {
  return <Stats />;
};

export default StatsTab;
