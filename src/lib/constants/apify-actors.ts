export type SearchSourceKey =
  | "mock_stepstone"
  | "mock_indeed"
  | "mock_linkedin_reference";

export interface ApifyActorDefinition {
  reference: string;
  source: SearchSourceKey;
  label: string;
  requiresRental?: boolean;
  enabledForSearch?: boolean;
}

export const curatedApifyActors: ApifyActorDefinition[] = [
  {
    reference: "hMvNSpz3JnHgl5jkh",
    source: "mock_indeed",
    label: "Indeed Scraper",
    enabledForSearch: true,
  },
  {
    reference: "MXLpngmVpE8WTESQr",
    source: "mock_indeed",
    label: "Indeed Jobs Scraper Borderline",
  },
  {
    reference: "IGjzUXKHqlsJaT58u",
    source: "mock_stepstone",
    label: "Stepstone Scraper",
    enabledForSearch: false,
  },
  {
    reference: "hKByXkMQaC5Qt9UMN",
    source: "mock_linkedin_reference",
    label: "LinkedIn Jobs Scraper",
    enabledForSearch: false,
  },
  {
    reference: "YGO6eh6ICQXnan9L4",
    source: "mock_linkedin_reference",
    label: "Xing Jobs Scraper",
    enabledForSearch: false,
  },
  {
    reference: "BHzefUZlZRKWxkTck",
    source: "mock_linkedin_reference",
    label: "LinkedIn Jobs Scraper Premium",
    requiresRental: true,
    enabledForSearch: false,
  },
];

export const curatedApifyActorReferences = curatedApifyActors.map((actor) => actor.reference);
