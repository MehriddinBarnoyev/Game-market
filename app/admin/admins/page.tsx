"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Admin {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  role: string;
  balance: number;
  avatar: string;
}

interface EmailLog {
  email: string;
  otp: string;
  timestamp: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAdmin, setNewAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const loadAdmins = async () => {
      setLoading(true);
      try {
        const fetchedAdmins = await fetchAdmins();
        setAdmins(fetchedAdmins);
        // In a real app, you would fetch email logs from the server
        // For this example, we'll use mock data
        setEmailLogs([
          {
            email: "user1@example.com",
            otp: "123456",
            timestamp: "2023-06-15T10:30:00Z",
          },
          {
            email: "user2@example.com",
            otp: "789012",
            timestamp: "2023-06-15T11:45:00Z",
          },
        ]);
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

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
        Manage Admins
      </h1>

      {newAdmin && (
        <Alert className="mb-4 bg-green-900 border-green-800 text-gray-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>New Admin Created</AlertTitle>
          <AlertDescription>
            Username: {newAdmin.username}, Email: {newAdmin.email}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Admin Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
          />
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Tabs defaultValue="admins" className="space-y-4">
          <TabsContent value="admins">
            <Card className="bg-black border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">Admin List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">
                          Username
                        </TableHead>
                        <TableHead className="text-gray-300 hidden md:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300 hidden lg:table-cell">
                          Balance
                        </TableHead>
                        <TableHead className="text-gray-300 hidden xl:table-cell">
                          Created At
                        </TableHead>
                        <TableHead className="text-gray-300 hidden sm:table-cell">
                          Avatar
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdmins.map((admin) => (
                        <TableRow key={admin.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-100">
                            {admin.username}
                          </TableCell>
                          <TableCell className="text-gray-300 hidden md:table-cell">
                            {admin.email}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {admin.role}
                          </TableCell>
                          <TableCell className="text-gray-300 hidden lg:table-cell">
                            ${admin.balance}
                          </TableCell>
                          <TableCell className="text-gray-300 hidden xl:table-cell">
                            {new Date(admin.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300 hidden sm:table-cell">
                            <img
                              src={admin.avatar || "/placeholder.svg"}
                              alt={admin.username}
                              className="w-8 h-8 rounded-full"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  );
}
