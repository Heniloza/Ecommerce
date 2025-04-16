import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, FilesIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ImageUpload = ({
  imageFile,
  setImageFile,
  uploadImageUrl,
  setUploadImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditable,
  isCustomStyling = false,
}) => {
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selectFile = e.target.files[0];
    if (selectFile) setImageFile(selectFile);
  };

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/uploadImage",
      data
    );
    // console.log(response);

    if (response.data?.success) {
      setUploadImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full ${isCustomStyling ? "" : "max-w-md mx-auto"} mt-4`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 ${
          isEditable ? "opacity-60" : ""
        }`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditable}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditable ? "cursor-not-allowed" : ""
            }flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop OR click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-16 w-full rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FilesIcon className="w-8 h-8 text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              varient="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
