import React, { useState } from "react";
import { jsPDF } from "jspdf";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    profile: "",
    education: "",
    skills: "",
    projects: "",
    certifications: "",
    softSkills: "",
    hobbies: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 10;
    const marginLeft = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const checkPageBreak = (extraSpace) => {
      if (y + extraSpace > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const addTitle = (title) => {
      checkPageBreak(lineHeight * 2);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, y, pageWidth - marginLeft, y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, marginLeft, y);
      y += 10;
    };

    const addText = (text) => {
      checkPageBreak(lineHeight * 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * marginLeft);
      doc.text(splitText, marginLeft, y);
      y += splitText.length * lineHeight + 5;
    };

    const addBulletPoints = (text) => {
      checkPageBreak(lineHeight * 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      const items = text.split(/\n| {3,}/).map((item) => item.trim()).filter(Boolean);

      if (text.includes("\n")) {
        items.forEach((item) => {
          checkPageBreak(lineHeight);
          doc.text(`• ${item}`, marginLeft, y);
          y += lineHeight;
        });
      } else {
        const columns = 2;
        const columnWidth = (pageWidth - 2 * marginLeft) / columns;
        let x = marginLeft;
        let yStart = y;

        items.forEach((item, index) => {
          checkPageBreak(lineHeight);
          doc.text(`• ${item}`, x, y);
          y += lineHeight;

          if ((index + 1) % Math.ceil(items.length / columns) === 0) {
            x += columnWidth;
            y = yStart;
          }
        });
      }
      y += 10;
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(formData.name, marginLeft, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${formData.email} | ${formData.phone}`, marginLeft, y);
    y += 10;
    doc.text(formData.address, marginLeft, y);
    y += 10;
    doc.text(formData.linkedin, marginLeft, y);
    y += 15;

    // Sections
    addTitle("Profile");
    addText(formData.profile);

    addTitle("Education");
    addText(formData.education);

    addTitle("Technical Skills");
    addBulletPoints(formData.skills);

    addTitle("Projects");
    addText(formData.projects);

    addTitle("Certifications");
    addBulletPoints(formData.certifications);

    addTitle("Soft Skills");
    addBulletPoints(formData.softSkills);

    addTitle("Hobbies");
    addBulletPoints(formData.hobbies);

    doc.save("resume.pdf");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Resume Builder</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Your Details</h3>
        <form className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-gray-700 capitalize">{key}</label>
              <textarea
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={getPlaceholder(key)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          ))}
        </form>
        <button
          onClick={generatePDF}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

// Function to return placeholders based on field name
const getPlaceholder = (key) => {
  const placeholders = {
    name: "Enter your full name",
    email: "Enter your email address",
    phone: "Enter your phone number",
    address: "Enter your address",
    linkedin: "Enter your LinkedIn profile URL",
    profile: "Write a short professional summary...",
    education: "Enter your education details...",
    skills: "List your technical skills (e.g., Python, React, MongoDB)",
    projects: "Describe your projects...",
    certifications: "List your certifications...",
    softSkills: "List your soft skills (e.g., Teamwork, Leadership)",
    hobbies: "List your hobbies (Use 3+ spaces for side-by-side format)",
  };
  return placeholders[key] || "";
};

export default ResumeBuilder;
