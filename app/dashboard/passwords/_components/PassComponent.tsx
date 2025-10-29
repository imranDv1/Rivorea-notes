"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Copy,
  Eye,
  KeyRound,
  SearchIcon,
  SquarePen,
  Trash2,
  User,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";

type Pass = {
  id: string;
  title: string;
  username: string;
  password: string;
  description: string;
  category: string;
};

type GetPass = {
  pass: Pass[];
};

const PassComponent = ({ pass }: GetPass) => {
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 ">
      <div className="flex flex-col lg:flex-row  items-center justify-between ">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold ">Password Management</h1>
          <p className="text-md text-muted-foreground">
            Manage all your passwords securely to not forget them again
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Manage Passwords</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new Password</DialogTitle>
              <DialogDescription>
                Add new Password to save it and manage it
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Title</Label>
                <Input
                  id="name-1"
                  name="name"
                  placeholder="Enter Title like Gmail , Facebook, etc "
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name-1">Decription</Label>
                <Input
                  id="name-1"
                  name="name"
                  placeholder="example Facebook account"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  placeholder="Enter user name or email"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter the password"
                />
              </div>

              <div className="w-full">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="apple">Social media</SelectItem>
                      <SelectItem value="banana">Work</SelectItem>
                      <SelectItem value="blueberry">Gmail</SelectItem>
                      <SelectItem value="grapes">Faceebook</SelectItem>
                      <SelectItem value="grapes">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full ">
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-3">
     

        {pass.map((pass) => (
          <Card key={pass.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pass.title}
                <Badge variant="outline">{pass.category}</Badge>
              </CardTitle>
              <CardDescription>{pass.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                <InputGroup>
                  <InputGroupInput value={pass.username} disabled />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>
                      <Copy />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <InputGroup>
                  <InputGroupInput type="password" value="12345678" disabled />
                  <InputGroupAddon>
                    <KeyRound />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>
                      <Eye />
                    </InputGroupButton>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton>
                      <Copy />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex items-center justify-between">
                <Button>
                  <SquarePen />
                  Edit
                </Button>
                <Button variant="outline">
                  {" "}
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
     
      </div>
    </div>
  );
};

export default PassComponent;
