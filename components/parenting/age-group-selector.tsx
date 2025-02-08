"use client";

import { motion } from "framer-motion";
import { BabyIcon, PersonStandingIcon, School, User } from "lucide-react";

const AGE_GROUPS = [
  {
    id: "infant",
    label: "Infant (0-1)",
    icon: BabyIcon,
    description: "Newborn to 12 months",
  },
  {
    id: "toddler",
    label: "Toddler (1-3)",
    icon: PersonStandingIcon,
    description: "Early development years",
  },
  {
    id: "preschool",
    label: "Preschool (3-5)",
    icon: School,
    description: "Pre-kindergarten phase",
  },
  {
    id: "school-age",
    label: "School Age (6+)",
    icon: User,
    description: "School-going children",
  },
];

export function AgeGroupSelector({ onSelect }: { onSelect: (age: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      {AGE_GROUPS.map((group) => (
        <motion.button
          key={group.id}
          onClick={() => onSelect(group.id)}
          className="flex flex-col items-center gap-2 p-6 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <group.icon className="w-8 h-8 text-primary" />
          <h3 className="font-medium">{group.label}</h3>
          <p className="text-sm text-muted-foreground text-center">
            {group.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
} 