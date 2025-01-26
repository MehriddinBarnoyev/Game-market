"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Game Market",
    contactEmail: "support@gamemarket.com",
    maxUploadSize: "10",
    enableRegistration: true,
    enableChat: true,
    maintenanceMode: false,
  });

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the settings to your backend
    console.log("Settings updated:", settings);
    toast({
      title: "Settings Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Admin Settings</h1>

      <Card className="bg-black rounded-2xl border-gray-700">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                className="bg-gray-900 border-gray-600 text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
              <Input
                id="maxUploadSize"
                name="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={handleChange}
                className="bg-gray-900 border-gray-600 text-gray-100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableRegistration"
                name="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableRegistration: checked,
                  }))
                }
                className="bg-gray-700"
              />
              <Label htmlFor="enableRegistration">
                Enable User Registration
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableChat"
                name="enableChat"
                checked={settings.enableChat}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, enableChat: checked }))
                }
                className="bg-gray-700"
              />
              <Label htmlFor="enableChat">Enable Chat Feature</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, maintenanceMode: checked }))
                }
                className="bg-gray-700"
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
            <Button type="submit" className="bg-purple-700 hover:bg-purple-800">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
