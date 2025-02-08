"use client";

import { motion } from "framer-motion";
import { Brain, Heart, Moon, Utensils, Users, Activity } from "lucide-react";

const TOPICS = [
  {
    id: "development",
    label: "Development",
    icon: Brain,
    description: "Physical and cognitive milestones",
  },
  {
    id: "behavior",
    label: "Behavior",
    icon: Heart,
    description: "Managing behavior and emotions",
  },
  {
    id: "sleep",
    label: "Sleep",
    icon: Moon,
    description: "Sleep patterns and routines",
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: Utensils,
    description: "Healthy eating habits",
  },
  {
    id: "social",
    label: "Social Skills",
    icon: Users,
    description: "Social development and interaction",
  },
  {
    id: "health",
    label: "Health",
    icon: Activity,
    description: "General health and wellness",
  },
];

export function TopicSelector({ onSelect }: { onSelect: (topic: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
      {TOPICS.map((topic) => (
        <motion.button
          key={topic.id}
          onClick={() => onSelect(topic.id)}
          className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <topic.icon className="w-6 h-6 text-primary" />
          <h3 className="font-medium">{topic.label}</h3>
          <p className="text-xs text-muted-foreground text-center">
            {topic.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
} 