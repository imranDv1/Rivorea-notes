"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { CountrySelector } from "./_component/CountrySelector";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useNotificationStore } from "@/context/notificationStore";
const ProfilePage = () => {
  const { data: session } = authClient.useSession();
  const [edit, setEdit] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState("/images/userefult.jpeg");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setProfileImage(session.user.image || "/images/userefult.jpeg");
    }
  }, [session]);

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch user's gender and country
  useEffect(() => {
    const fetchUserPlusInfo = async () => {
      if (!session?.user.id) return;

      try {
        const res = await fetch(`/api/user/profile?userId=${session.user.id}`);
        const data = await res.json();
        if (data.success && data.user.UserPlusInfo) {
          setGender(data.user.UserPlusInfo.gender || "");
          setCountry(data.user.UserPlusInfo.country || "");
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUserPlusInfo();
  }, [session?.user.id]);

  const [saveLoading, setSaveLoaing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };
  const triggerRefresh = useNotificationStore((state) => state.triggerRefresh);
  const handleSave = async () => {
    if (!session?.user.id) return;
    const formData = new FormData();
    formData.append("userId", session.user.id);
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("country", country);
    if (imageFile) formData.append("imageFile", imageFile);
    setSaveLoaing(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        setEdit(true)
         triggerRefresh();
        setSaveLoaing(false);
      } else {
        toast.error("Error: " + (data.message || data.error));
        setSaveLoaing(false);
      }
    } catch (err) {
      setSaveLoaing(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Profile Info</span>
            <Button onClick={() => setEdit(!edit)}>
              {edit ? "Edit" : "Cancel"}
            </Button>
          </CardTitle>
          <CardDescription>
            All your info here you can edit it if you want
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label>Name</Label>
            <Input
              disabled={edit}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex flex-col gap-3">
              <Label>Gender</Label>
              <Select disabled={edit} value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Country</Label>
              <CountrySelector
                edit={edit}
                value={country}
                onChange={setCountry}
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <label className="relative w-32 h-32 cursor-pointer">
              <Image
                src={profileImage}
                alt="Profile Image"
                width={128}
                height={128}
                className="object-cover border-2"
              />
              {!edit && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={edit || saveLoading}
            className="text-white w-full"
            variant="outline"
            onClick={handleSave}
          >
            {saveLoading ? (
              <>
                <Spinner />
                <span>Saving profile Changes...</span>
              </>
            ) : (
              <span>Save Profile Changes </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
