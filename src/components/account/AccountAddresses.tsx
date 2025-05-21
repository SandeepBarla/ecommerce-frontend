
import { useState } from "react";
import { useAuth, Address } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";
import AddressForm from "./AddressForm";

const AccountAddresses = () => {
  const { user, removeAddress, setDefaultAddress } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  
  const handleEditAddress = (address: Address) => {
    setEditAddress(address);
    setOpenDialog(true);
  };
  
  const handleAddNewAddress = () => {
    setEditAddress(null);
    setOpenDialog(true);
  };
  
  const handleRemoveAddress = (addressId: string) => {
    if (confirm("Are you sure you want to remove this address?")) {
      removeAddress(addressId);
    }
  };
  
  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
  };
  
  const closeDialog = () => {
    setOpenDialog(false);
    setEditAddress(null);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Addresses</CardTitle>
          <Button
            onClick={handleAddNewAddress}
            className="bg-ethnic-purple hover:bg-ethnic-purple/90"
            size="sm"
          >
            <Plus size={16} className="mr-1" /> Add New Address
          </Button>
        </CardHeader>
        
        <CardContent>
          {user?.addresses && user.addresses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {user.addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-md p-4 relative ${
                    address.isDefault ? "border-ethnic-purple bg-ethnic-purple/5" : ""
                  }`}
                >
                  {address.isDefault && (
                    <span className="absolute top-2 right-2 text-xs bg-ethnic-purple text-white px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                  
                  <div className="flex items-start mb-3">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{address.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {address.street}, {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phone: {address.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                    {!address.isDefault && (
                      <div className="flex items-center">
                        <Switch
                          id={`default-${address.id}`}
                          checked={address.isDefault}
                          onCheckedChange={() => handleSetDefault(address.id)}
                        />
                        <Label htmlFor={`default-${address.id}`} className="ml-2 text-sm">
                          Set as default
                        </Label>
                      </div>
                    )}
                    
                    <div className="flex gap-2 ml-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-destructive hover:text-destructive"
                        onClick={() => handleRemoveAddress(address.id)}
                      >
                        <Trash2 size={14} className="mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
              <h3 className="font-medium text-lg mb-1">No addresses found</h3>
              <p className="text-muted-foreground mb-4">Add your first address to get started</p>
              <Button 
                onClick={handleAddNewAddress}
                className="bg-ethnic-purple hover:bg-ethnic-purple/90"
              >
                <Plus size={16} className="mr-1" /> Add Address
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          
          <AddressForm
            existingAddress={editAddress}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountAddresses;
