import React, { useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UploadCloudIcon } from "lucide-react";

const ImageUpload = ({
  imageFile,
  setImageFile,
  uploadImageUrl,
  setUploadImageUrl,
}) => {
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selectFile = e.target.files[0];
    if(selectFile) setImageFile(selectFile)
  };

  return (
    <div className="w-full mad-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div>
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />
        {
          !imageFile ? 
          <Label htmlFor="image-upload" className="flex flex-col items-center justify-center h-32 cursor-pointer">
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2"/>
            <span>Drag & drop OR click to upload image</span>
          </Label>
          :<div></div>
        }
      </div>
    </div>
  );
};

export default ImageUpload;
