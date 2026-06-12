export const SUBJECT_COLORS = {
  Mathematics: "from-[#3B82F6] to-[#60A5FA]", // Blue
  Science: "from-[#10B981] to-[#34D399]", // Emerald
  English: "from-[#F97316] to-[#FDBA74]", // Orange
  "Social Science": "from-[#F59E0B] to-[#FCD34D]", // Amber
  "Computer Science": "from-[#8B5CF6] to-[#A78BFA]", // Purple
  Hindi: "from-[#EF4444] to-[#F87171]", // Red
  default: "from-primary to-primary/80",
};

export const SUBJECT_COLORS_HEX = {
  Mathematics: "#3B82F6",
  Science: "#10B981",
  English: "#F97316",
  "Social Science": "#F59E0B",
  "Computer Science": "#8B5CF6",
  Hindi: "#EF4444",
  default: "#0A1628",
};

export const getSubjectGradient = (subjectName: string) => {
  return SUBJECT_COLORS[subjectName as keyof typeof SUBJECT_COLORS] || SUBJECT_COLORS.default;
};

export const getSubjectColor = (subjectName: string) => {
  return SUBJECT_COLORS_HEX[subjectName as keyof typeof SUBJECT_COLORS_HEX] || SUBJECT_COLORS_HEX.default;
};
