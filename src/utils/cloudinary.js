// utils/cloudinary.js
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "expense_tracker_upload"); // Set in Cloudinary settings

  const res = await fetch(`https://api.cloudinary.com/v1_1/dftyg61kb/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url; // This is the image URL you save to DB
};
