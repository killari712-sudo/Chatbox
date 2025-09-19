import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, MessagesSquare, Smile } from "lucide-react";

export function DashboardView() {
  return (
    <div className="p-4 md:p-6">
        <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold">Welcome to EcosystemAI</h2>
            <p className="text-muted-foreground">Your personal AI assistant for a better you. Here's what you can do:</p>
        </div>
        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mood-Based Chat</CardTitle>
            <MessagesSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <p className="text-xs text-muted-foreground">
                Engage with an AI that understands and adapts to your emotional state.
            </p>
            </CardContent>
        </Card>
        <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Proactive Suggestions</CardTitle>
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <p className="text-xs text-muted-foreground">
                Get personalized recommendations based on your goals and challenges.
            </p>
            </CardContent>
        </Card>
        <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mood Tracking</CardTitle>
            <Smile className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <p className="text-xs text-muted-foreground">
                The UI adapts to your mood, creating a more empathetic experience.
            </p>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
