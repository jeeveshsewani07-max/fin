import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  buttonText?: string;
}

export function ModuleCard({ title, description, icon: Icon, color, onClick, buttonText = 'Open' }: ModuleCardProps) {
  return (
    <Card className="h-full hover:scale-105 transition-transform duration-200 cursor-pointer flex flex-col" onClick={onClick}>
      <CardHeader className="pb-4 flex-1">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4`} style={{ backgroundColor: color }}>
          <Icon size={32} className="text-white" />
        </div>
        <h3 className="text-xl text-card-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <Button className="w-full h-12" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}