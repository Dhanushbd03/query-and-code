import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2, Link } from "lucide-react";
import useLanguage from "@/stores/logic/useLanguage";
import { Language } from "@/models/model";

export default function Languages() {
  const { languages, loading, getLanguages, addLanguage, updateLanguage, deleteLanguage } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    github_url: "",
  });

  useEffect(() => {
    getLanguages();
  }, [getLanguages]);

  const handleAdd = async () => {
    try {
      await addLanguage(formData.name, formData.description, formData.github_url);
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "", github_url: "" });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleEdit = async () => {
    if (!selectedLanguage) return;
    try {
      await updateLanguage(selectedLanguage.id, {
        name: formData.name,
        description: formData.description,
        github_url: formData.github_url,
      });
      setIsEditDialogOpen(false);
      setSelectedLanguage(null);
      setFormData({ name: "", description: "", github_url: "" });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      try {
        await deleteLanguage(id);
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  const openEditDialog = (language: Language) => {
    setSelectedLanguage(language);
    setFormData({
      name: language.name,
      description: language.description || "",
      github_url: language.github_url || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Languages</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ctp-flamingo hover:bg-ctp-flamingo/90 text-ctp-base">
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-ctp-surface0 border-ctp-flamingo">
            <DialogHeader>
              <DialogTitle className="text-ctp-text">Add New Language</DialogTitle>
              <DialogDescription className="text-ctp-subtext0">
                Add a new programming language with its GitHub documentation URL.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-ctp-text">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter language name"
                  className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-ctp-text">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                />
              </div>
              <div>
                <Label htmlFor="github_url" className="text-ctp-text">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="Enter GitHub repository URL"
                  className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
                />
              </div>
              <Button onClick={handleAdd} disabled={!formData.name || loading} className="w-full bg-ctp-flamingo hover:bg-ctp-flamingo/90 text-ctp-base">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Language"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-ctp-surface0 border-ctp-flamingo">
          <DialogHeader>
            <DialogTitle className="text-ctp-text">Edit Language</DialogTitle>
            <DialogDescription className="text-ctp-subtext0">
              Update the language details and GitHub URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-ctp-text">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter language name"
                className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-ctp-text">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
              />
            </div>
            <div>
              <Label htmlFor="edit-github_url" className="text-ctp-text">GitHub URL</Label>
              <Input
                id="edit-github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="Enter GitHub repository URL"
                className="bg-ctp-surface1 border-ctp-flamingo text-ctp-text"
              />
            </div>
            <Button onClick={handleEdit} disabled={!formData.name || loading} className="w-full bg-ctp-flamingo hover:bg-ctp-flamingo/90 ">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Language"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">GitHub URL</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {languages.map((language) => (
              <TableRow key={language.id}>
                <TableCell className="text-white">{language.name}</TableCell>
                <TableCell className="text-white">{language.description}</TableCell>
                <TableCell>
                  {language.github_url && (
                    <a
                      href={language.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300"
                    >
                      <Link className="h-4 w-4 mr-1" />
                      Repository
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(language)}
                      className="bg-ctp-base hover:bg-ctp-flamingo/90"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(language.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {languages.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-white">
                  No languages found. Add your first language to get started.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-white">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 