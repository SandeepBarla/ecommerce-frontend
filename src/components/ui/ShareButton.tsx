import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Facebook,
  Mail,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const ShareButton = ({
  url,
  title,
  description,
  className,
}: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        } catch {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          toast.success("Link copied to clipboard!");
        }
        setIsOpen(false);
      },
      className: "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => {
        const whatsappText = `${title}\n\n${
          description ? description + "\n\n" : ""
        }${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          whatsappText
        )}`;
        window.open(whatsappUrl, "_blank");
        setIsOpen(false);
      },
      className: "text-green-600 hover:text-green-700 hover:bg-green-50",
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(facebookUrl, "_blank", "width=600,height=400");
        setIsOpen(false);
      },
      className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => {
        const twitterText = `${title}${description ? " - " + description : ""}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          twitterText
        )}&url=${encodedUrl}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
        setIsOpen(false);
      },
      className: "text-blue-400 hover:text-blue-500 hover:bg-blue-50",
    },
    {
      name: "Email",
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`Check out: ${title}`);
        const body = encodeURIComponent(
          `I thought you might be interested in this:\n\n${title}\n\n${
            description ? description + "\n\n" : ""
          }${url}`
        );
        const emailUrl = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = emailUrl;
        setIsOpen(false);
      },
      className: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
    },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center text-muted-foreground hover:text-ethnic-purple transition-colors group ${className}`}
        >
          <Share2
            size={16}
            className="mr-2 group-hover:scale-110 transition-transform"
          />
          Share this product
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 bg-white/95 backdrop-blur-sm border border-purple-100 shadow-xl rounded-xl p-2"
      >
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900">
            Share this product
          </p>
          <p className="text-xs text-gray-500 truncate mt-1">{title}</p>
        </div>
        <DropdownMenuSeparator className="bg-purple-100" />

        {shareOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={option.action}
            className={`flex items-center px-3 py-3 rounded-lg transition-colors cursor-pointer ${option.className} focus:outline-none`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current/10 mr-3">
              <option.icon size={16} className="text-current" />
            </div>
            <span className="font-medium text-current">{option.name}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-purple-100 mt-2" />
        <div className="px-3 py-2 mt-2">
          <p className="text-xs text-gray-400 text-center">
            Share with friends and family
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
