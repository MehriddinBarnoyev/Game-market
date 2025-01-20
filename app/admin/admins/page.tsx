"use client";

import { useState, useEffect } from "react";
import { fetchAdmins } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Admin {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdmin, setNewAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      try {
        const fetchedAdmins = await fetchAdmins();
        setAdmins(fetchedAdmins);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  useEffect(() => {
    const lastAdmin = admins[admins.length - 1];
    if (
      lastAdmin &&
      new Date(lastAdmin.createdAt).getTime() > Date.now() - 60000
    ) {
      setNewAdmin(lastAdmin);
      const timer = setTimeout(() => setNewAdmin(null), 60000);
      return () => clearTimeout(timer);
    }
  }, [admins]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Admins</h1>

      {newAdmin && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>New Admin Created</AlertTitle>
          <AlertDescription>
            Username: {newAdmin.username}, Email: {newAdmin.email}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6 bg-black border-gray-600 rounded-2xl">
        <CardHeader>
          <CardTitle>Admin Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Card className="bg-black border-gray-600 rounded-2xl ">
          <CardHeader>
            <CardTitle>Admin List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.username}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.password}</TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
