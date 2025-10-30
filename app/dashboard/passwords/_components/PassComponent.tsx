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
import { Suspense, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CreateNewPass, { DeletePass, EditPass } from "../action";
import { toast } from "sonner";
import { useAddPassNotificationStore } from "@/context/addPass";
import { Spinner } from "@/components/ui/spinner";

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

type PassForm = {
  title: string;
  username: string;
  password: string;
  description: string;
  category: string;
};

const PassComponent = ({ pass }: GetPass) => {
  const { register, handleSubmit, control, reset } = useForm<PassForm>({
    defaultValues: {
      title: "",
      username: "",
      password: "",
      description: "",
      category: "",
    },
  });

  const [DialogOpen, closeDialog] = useState(false);
  const [CreateLoading, setCreateLaoding] = useState(false);
  const [DeleteLoading, setDeleteLoading] = useState(false);
  const [PassTodelete, setPassTodelete] = useState("");
  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [EditDialogOpen, setEditDialogOpen] = useState(false);
  const [EditLoading, setEditLoading] = useState(false);
  const [EditTarget, setEditTarget] = useState<Pass | null>(null);
  const refreshAddPass = useAddPassNotificationStore(
    (state) => state.refreshAddPass
  );

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    reset: resetEdit,
  } = useForm<Partial<PassForm>>({
    defaultValues: {
      title: "",
      username: "",
      password: "",
      description: "",
      category: "",
    },
  });

  function openEdit(passItem: Pass) {
    setEditTarget(passItem);
    resetEdit({
      title: passItem.title,
      username: passItem.username,
      description: passItem.description,
      category: passItem.category,
      password: "",
    });
    setEditDialogOpen(true);
  }

  const onSubmitEdit: SubmitHandler<Partial<PassForm>> = async (values) => {
    if (!EditTarget) return;
    const payload: any = { id: EditTarget.id };
    if (values.title) payload.title = values.title;
    if (values.description) payload.description = values.description;
    if (values.username) payload.emailOruser = values.username;
    if (values.category) payload.category = values.category;
    if (values.password) payload.password = values.password;
    setEditLoading(true);
    try {
      const res = await EditPass(payload);
      if (res.success) {
        toast.success(res.message);
        setEditDialogOpen(false);
        setEditLoading(false);
        refreshAddPass();
      } else {
        toast.error(res.message);
        setEditDialogOpen(false);
        setEditLoading(false);
      }
    } catch (e) {
      setEditLoading(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredPasses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let base = pass;
    if (activeCategory) {
      base = base.filter((p) => p.category === activeCategory);
    }
    if (!q) return base;
    return base.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [pass, searchQuery, activeCategory]);

  const isLoadingPasses = CreateLoading || DeleteLoading;

  const SkeletonCard = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between animate-pulse">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
        <div className="h-4 w-48 bg-muted rounded mt-2 animate-pulse" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between">
          <div className="h-9 w-20 bg-muted rounded animate-pulse" />
          <div className="h-9 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
  const onSubmit: SubmitHandler<PassForm> = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("emailOruser", values.username);
    formData.append("password", values.password);
    formData.append("category", values.category);
    setCreateLaoding(true);
    try {
      const res = await CreateNewPass(formData);
      if (res.success) {
        toast.success(res.message);
        closeDialog(false);
        refreshAddPass();
        setCreateLaoding(false);
      } else {
        toast.error(res.message);
        closeDialog(false);
        setCreateLaoding(false);
      }
    } catch (error) {
      setCreateLaoding(false);
    }
  };

  function HandleDelete(id: string) {
    setDeleteDialogOpen(true);
    setPassTodelete(id);
  }

  async function ConfermDelete() {
    if (!PassTodelete) return;
    setDeleteLoading(true);
    try {
      const res = await DeletePass(PassTodelete);
      if (res.success) {
        toast.success(res.message);
        refreshAddPass();
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
      } else {
        toast.error(res.message);
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      toast.error("somthing want wrong");
      setDeleteLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-5 ">
      <div className="flex flex-col lg:flex-row  items-center justify-between ">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold ">Password Management</h1>
          <p className="text-md text-muted-foreground">
            Manage all your passwords securely to not forget them again
          </p>
        </div>
        <Button onClick={() => closeDialog(!DialogOpen)}>
          Create new Passwords
        </Button>
        <Dialog open={DialogOpen}>
          <DialogTrigger asChild></DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new Password</DialogTitle>
              <DialogDescription>
                Add new Password to save it and manage it
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter Title like Gmail , Facebook, etc "
                  {...register("title")}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Decription</Label>
                <Input
                  id="description"
                  required
                  placeholder="example Facebook account"
                  {...register("description")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  required
                  placeholder="Enter user name or email"
                  {...register("username")}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter the password"
                  {...register("password")}
                />
              </div>

              <div className="w-full">
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { value, onChange } }) => (
                    <Select required value={value} onValueChange={onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          <SelectItem value="social-media">
                            Social media
                          </SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={CreateLoading} type="submit">
                  {CreateLoading ? (
                    <>
                      <Spinner />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Save changes</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full ">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        {activeCategory && (
          <div className="mt-2 text-sm">
            <span>Filtering by category: </span>
            <Badge
              className="ml-1 cursor-pointer select-none"
              onClick={() => setActiveCategory(null)}
            >
              {activeCategory} (clear)
            </Badge>
          </div>
        )}
      </div>
      <Dialog open={DeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this Password? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              onClick={() => setDeleteDialogOpen(!DeleteDialogOpen)}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              onClick={ConfermDelete}
              disabled={DeleteLoading}
              size="lg"
              className="bg-red-500 hover:bg-red-500"
            >
              {DeleteLoading ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={EditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Update only the fields you want to change
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(onSubmitEdit)}
            className="grid gap-4"
          >
            <div className="grid gap-3">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Title"
                {...registerEdit("title")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Description"
                {...registerEdit("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                placeholder="Username or email"
                {...registerEdit("username")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Leave blank to keep current"
                {...registerEdit("password")}
              />
            </div>
            <div className="w-full">
              <Controller
                control={controlEdit}
                name="category"
                render={({ field: { value, onChange } }) => (
                  <Select value={value || ""} onValueChange={onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="social-media">
                          Social media
                        </SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={EditLoading}>
                {EditLoading ? (
                  <>
                    <Spinner />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Save changes</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-3">
        {isLoadingPasses && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!isLoadingPasses &&
          filteredPasses.map((pass) => (
            <Card key={pass.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {pass.title}
                  <Badge
                    onClick={() =>
                      setActiveCategory((prev) =>
                        prev === pass.category ? null : pass.category
                      )
                    }
                    className="cursor-pointer select-none"
                    variant="outline"
                  >
                    {pass.category}
                  </Badge>
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
                      <InputGroupButton
                        onClick={() => {
                          navigator.clipboard.writeText(pass.username);
                          toast.success("Username copied!");
                        }}
                        type="button"
                      >
                        <Copy />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div>
                  <InputGroup>
                    <InputGroupInput
                      type="password"
                      value={pass.password}
                      disabled
                    />
                    <InputGroupAddon>
                      <KeyRound />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        onClick={(e) => {
                          const input =
                            e.currentTarget.parentElement?.parentElement?.querySelector(
                              "input"
                            ) as HTMLInputElement;
                          if (input) {
                            input.type =
                              input.type === "password" ? "text" : "password";
                          }
                        }}
                      >
                        <Eye />
                      </InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={() => {
                          navigator.clipboard.writeText(pass.password);
                          toast.success("password copied!");
                        }}
                      >
                        <Copy />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex items-center justify-between">
                  <Button onClick={() => openEdit(pass)}>
                    <SquarePen />
                    Edit
                  </Button>
                  <Button
                    onClick={() => HandleDelete(pass.id)}
                    variant="outline"
                  >
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
