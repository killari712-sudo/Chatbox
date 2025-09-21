
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.356-11.303-8H2.389v8.388C5.571,40.21,14.085,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C44.982,36.351,48,30.686,48,24C48,22.659,47.862,21.35,47.611,20.083z"></path>
    </svg>
);


export function AuthView({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("login");

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const result = await signInWithEmail(emailLogin, passwordLogin);
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            onOpenChange(false);
        }
    }
    
    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const result = await signUpWithEmail(emailSignUp, passwordSignUp);
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            onOpenChange(false);
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        await signInWithGoogle();
        setLoading(false);
        onOpenChange(false);
    }

    const onDialogClose = (open: boolean) => {
      if (!open) {
        setError(null);
        setLoading(false);
      }
      onOpenChange(open);
    }

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">{activeTab === 'login' ? 'Login to your account' : 'Create an account'}</DialogTitle>
                    <DialogDescription className="text-center">{activeTab === 'login' ? 'Enter your credentials to access your dashboard.' : 'Enter your email below to create your account.'}</DialogDescription>
                </DialogHeader>
                <TabsList className="grid w-full grid-cols-2 mt-4">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <div className="p-1 pt-4">
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-login">Email</Label>
                                <Input id="email-login" type="email" placeholder="m@example.com" required value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-login">Password</Label>
                                <Input id="password-login" type="password" required value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                        </form>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                            Google
                        </Button>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                </TabsContent>
                <TabsContent value="signup">
                <div className="p-1 pt-4">
                        <form onSubmit={handleEmailSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-signup">Email</Label>
                                <Input id="email-signup" type="email" placeholder="m@example.com" required value={emailSignUp} onChange={(e) => setEmailSignUp(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-signup">Password</Label>
                                <Input id="password-signup" type="password" required value={passwordSignUp} onChange={(e) => setPasswordSignUp(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                        </form>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>
  );
}
