export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Validasi file
    if (!file) {
      reject('No file selected');
      return;
    }

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      reject('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'souecedev'); // Ganti
    formData.append('cloud_name', 'dbssvz2pe'); // Ganti
    formData.append('folder', 'sourcecode-thumbnails'); // Folder di Cloudinary

    fetch(`https://api.cloudinary.com/v1_1/dbssvz2pe/image/upload`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.secure_url) {
        resolve(data.secure_url);
      } else {
        reject(data.error?.message || 'Upload failed');
      }
    })
    .catch(error => {
      console.error('Upload error:', error);
      reject('Upload failed. Please try again.');
    });
  });
};

// Function untuk delete image dari Cloudinary (optional)
export const deleteFromCloudinary = async (imageUrl) => {
  // Extract public_id dari URL
  const publicId = imageUrl.split('/').pop().split('.')[0];
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/destroy?public_id=${publicId}`,
      {
        method: 'DELETE',
      }
    );
    return response.json();
  } catch (error) {
    console.error('Delete error:', error);
  }
};