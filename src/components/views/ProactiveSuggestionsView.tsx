"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getSuggestions } from "@/app/actions";
import { Lightbulb, Loader2 } from "lucide-react";

const formSchema = z.object({
  userGoals: z.string().min(10, "Please describe your goals in more detail."),
  userHabits: z.string().min(10, "Please describe your habits in more detail."),
  userChallenges: z.string().min(10, "Please describe your challenges in more detail."),
});

type FormData = z.infer<typeof formSchema>;

export function ProactiveSuggestionsView() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userGoals: "",
      userHabits: "",
      userChallenges: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    const result = await getSuggestions(data);
    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.suggestions) {
      setSuggestions(result.suggestions);
    }
  };

  return (
    <div className="p-4 md:p-6 grid gap-8 md:grid-cols-2">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="font-headline">Tell us about yourself</CardTitle>
          <CardDescription>
            The more we know, the better we can help. Share your goals, habits, and challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I want to improve my focus and reduce stress..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userHabits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Habits</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I tend to procrastinate on big tasks..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userChallenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Challenges</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I find it hard to stay motivated when working alone..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : "Get Suggestions"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-headline text-2xl">Your Suggestions</h2>
        {isLoading && (
          <div className="flex items-center justify-center pt-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="glassmorphism">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <p className="pt-1">{suggestion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && !error && suggestions.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg glassmorphism">
                <p className="text-muted-foreground">Your personalized suggestions will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
