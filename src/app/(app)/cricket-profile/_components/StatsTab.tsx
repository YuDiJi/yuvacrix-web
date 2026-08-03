import { Stats } from "@/components/stats/page";
import { CricketProfile } from "@/types/cricketProfile";
import React from "react";

type MatchesTabProps = {
  profile: CricketProfile;
};

const StatsTab = ({ profile }: MatchesTabProps) => {
  return <Stats />;
};

export default StatsTab;
