import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BasicDetailsForm from "../components/BasicFormDetails";
import LocationDetailsForm from "../components/LocationDetailsForm";
import ApartmentProfileForm from "../components/ApartmentProfileForm";
import PlotProfileForm from "../components/PlotProfileForm";
import HouseProfileForm from "../components/HouseProfileForm";
import PhotosForm from "../components/PhotosForm";
import PricingForm from "../components/PricingForm";
import styles from "./Rent.module.css";

const Rent: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    address: "",
    city: "",
    price: "",
    landmark: "",
    bhk: "",
    bathrooms: "",
    balconies: "",
    other_rooms: "",
    area: "",
    type: "Residential",
    status: "Available",
    floors: "",
    availability_status: "Ready to move",
    purpose: "sell",
    phone: "",
    mail: "",
    amenities: "",
    Propreiter_name: "",
    Propreiter_email: "",
    Propreiter_contact: "",
    // Apartment specific fields
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    numberOfBalconies: "",
    areaDetails: "",
    totalFloorDetails: "",
    propertyFloorDetails: "",
    // House specific fields
    studyRoom: false,
    poojaRoom: false,
    servantRoom: false,
    storeRoom: false,
    ageOfProperty: "",
    possessionDate: "",
    availability: "Ready to move",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const nextStep = () => setStep(prevStep => prevStep + 1);
  const prevStep = () => {
    console.log("Current step:", step); 
    setStep(prevStep => prevStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const propertyResponse = await axios.post('http://localhost:5000/api/property', formData);
      const propertyId = propertyResponse.data._id;

      const imageUploadPromises = selectedImages.map(image => {
        const formData = new FormData();
        formData.append('property_id', propertyId);
        formData.append('image_url', image);
        return axios.post('http://localhost:5000/api/property-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      });

      await Promise.all(imageUploadPromises);
      alert('Property listed successfully!');
    } catch (error) {
      console.error("Error uploading property or images:", error);
      alert('Failed to list property.');
    }
  };

  const renderPropertyProfileForm = () => {
    switch (formData.propertyType) {
      case "Apartment":
        return (
          <ApartmentProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "Plot":
        return (
          <PlotProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "House":
        return (
          <HouseProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.rent}>
      <Navbar />
      <div className={styles.body}>
        <main className={styles.content}>
          <div className={styles.box}>
            <h3>Few more steps to get your property posted</h3>
            <p>Providing clear details about your property finds you good buyers</p>
          </div>
          {step === 1 && (
            <BasicDetailsForm
              formData={formData}
              handleInputChange={handleInputChange}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <LocationDetailsForm
              formData={formData}
              handleInputChange={handleInputChange}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && renderPropertyProfileForm()}
          {step === 4 && (
            <PhotosForm
              handleImageChange={handleImageChange}
              handleRemoveImage={handleRemoveImage}
              selectedImages={selectedImages}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 5 && (
            <PricingForm
              formData={formData}
              handleInputChange={handleInputChange}
              prevStep={prevStep}
              handleSubmit={handleSubmit}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Rent;
