
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { Address } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelect: (addressId: string) => void;
}

const AddressSelector = ({ addresses, selectedAddressId, onSelect }: AddressSelectorProps) => {
  // Pre-select default address if one exists and none is selected
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        onSelect(defaultAddress.id);
      } else {
        onSelect(addresses[0].id);
      }
    }
  }, [addresses, selectedAddressId, onSelect]);

  return (
    <div>
      <RadioGroup value={selectedAddressId} onValueChange={onSelect} className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-md p-4 hover:border-ethnic-purple transition-colors ${
              selectedAddressId === address.id ? "border-ethnic-purple ring-1 ring-ethnic-purple" : ""
            }`}
          >
            <RadioGroupItem
              value={address.id}
              id={address.id}
              className="sr-only"
            />
            <Label
              htmlFor={address.id}
              className="flex items-start cursor-pointer"
            >
              <MapPin className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{address.name}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Default</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {address.street}, {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="mt-4">
        <Link to="/account/addresses">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Plus size={16} className="mr-1" /> Add New Address
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AddressSelector;
