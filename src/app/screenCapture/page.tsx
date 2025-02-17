"use client";

import Navbar from "../navbar/page";
import { useState } from "react";

const ScreenCapture = () => {
  // Set the number of images per page
  const imagesPerPage = 8;
  // Example list of images (you can replace with actual image URLs)
  const images = [
    "/image.jpg", "/image.jpg", "/image.jpg", "/image.jpg", "/image.jpg",
    "/image.jpg", "/image.jpg", "/image.jpg", "/image.jpg", "/image.jpg",
    "/image.jpg", "/image.jpg", "/image.jpg", "/image.jpg", "/image.jpg",
  ];

  // State for current page and modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Calculate the current images to be displayed based on current page
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  // Calculate the total number of pages
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // Function to handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to open the modal with the clicked image
  const openModal = (image) => {
    setSelectedImage(image);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-6">
        <div className="space-y-6">
          {/* Row 1 - 1 Card */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">
              {/* Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {currentImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-auto rounded cursor-pointer"
                      onClick={() => openModal(image)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <img src={selectedImage} alt="Expanded Image" className="max-w-full max-h-screen object-contain" />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenCapture;
