"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Bell,
  Shield,
  Database,
  Download,
  Trash2,
  Palette,
  Layout,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";  
const Page = () => {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  // Display Preferences
  const [compactMode, setCompactMode] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState("12");
  const [language, setLanguage] = useState("en");

  // Privacy & Security
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Data Management
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCompactMode = localStorage.getItem("compactMode") === "true";
      const savedShowCategories =
        localStorage.getItem("showCategories") !== "false";
      const savedItemsPerPage = localStorage.getItem("itemsPerPage") || "12";
      const savedLanguage = localStorage.getItem("language") || "en";
      const savedEmailNotifications =
        localStorage.getItem("emailNotifications") !== "false";
      const savedShowEmail = localStorage.getItem("showEmail") === "true";
      const savedSessionTimeout =
        localStorage.getItem("sessionTimeout") || "30";

      setCompactMode(savedCompactMode);
      setShowCategories(savedShowCategories);
      setItemsPerPage(savedItemsPerPage);
      setLanguage(savedLanguage);
      setEmailNotifications(savedEmailNotifications);
      setShowEmail(savedShowEmail);
      setSessionTimeout(savedSessionTimeout);
    }
  }, []);





  const handleDeleteAccount = async () => {
    if (!userId) return;

    try {
      // In a real app, this would delete the user account
      toast.error("Account deletion feature coming soon");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="w-full min-h-screen p-3 md:p-6">
      <div className="w-full mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          
        
      
            
           
          </CardContent>
        </Card>

      
    
     
   

        {/* Account Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Account Information</CardTitle>
            </div>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email || "Not available"}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/profile">Edit Profile</a>
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Account Created</Label>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>
            <Separator />
            {/* logout button */}
            <div className="flex items-center justify-between">
                <p>Logout</p>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
            </div>
          </CardContent>
        </Card>

   
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone. All your notes, favorites, and data will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
