"use client";

import NavbarEmployer from "@/app/navbarEmployer/page";
import { useState } from "react";
import { employees } from "../dummyData";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js elements
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedEmployees = employees.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(displayedEmployees.map((emp) => emp.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectEmployee = (id: number) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((empId) => empId !== id) : [...prevSelected, id]
    );
  };

  const handlePageChange = (direction: string) => {
    if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const generatePDFsAndZip = async () => {
    const zip = new JSZip();

    for (const id of selectedEmployees) {
      const emp = employees.find((e) => e.id === id);
      if (!emp) continue;

      const pdf = new jsPDF();
      let y = 20;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Employee Performance Report", 14, y);
      y += 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, y);
      y += 10;
      pdf.setFontSize(12);
      pdf.text(`Employee Name: ${emp.name}`, 14, y);
      y += 8;
      pdf.text(`Blink Rate: ${emp.activeness.blinkRate}`, 14, y);
      y += 6;
      pdf.text(`Yawning Frequency: ${emp.activeness.yawningFrequency}`, 14, y);
      y += 6;
      pdf.text(`Active Duration: ${emp.activeness.duration}`, 14, y);
      y += 10;

      const hiddenDiv = document.createElement("div");
      hiddenDiv.style.position = "absolute";
      hiddenDiv.style.left = "-9999px";
      document.body.appendChild(hiddenDiv);

      const canvas = document.createElement("canvas");
      hiddenDiv.appendChild(canvas);
      canvas.width = 250; // Reduced width
      canvas.height = 150; // Reduced height
      
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      
      const barColors = ["#FF5733", "#33FFCE", "#FFC300"]; // Bar colors
      const legendColor = "#4A90E2"; // Different color for legend
      
      const chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Blink Rate", "Yawning Frequency", "Active Duration"],
          datasets: [
            {
              label: emp.name,
              data: [
                parseInt(emp.activeness.blinkRate.replace(" blinks/min", "")),
                parseInt(emp.activeness.yawningFrequency.replace(" yawns in 10 mins", "")),
                parseFloat(emp.activeness.duration.replace(" hours", "")),
              ],
              backgroundColor: barColors, // Bars with distinct colors
              borderColor: ["#C70039", "#009688", "#FF8C00"], // Border colors for distinction
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            x: {
              categoryPercentage: 0.5,
              barPercentage: 0.8,
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: legendColor, // Unique legend color
                usePointStyle: true,
              },
            },
          },
        },
      });
      
      

      await new Promise((resolve) => setTimeout(resolve, 500));
      const canvasImage = await html2canvas(hiddenDiv);
      const imgData = canvasImage.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 14, y, 180, 80);
      y += 90;

      chart.destroy();
      document.body.removeChild(hiddenDiv);

      const pdfBlob = pdf.output("blob");
      zip.file(`${emp.name}_${startDate}_to_${endDate}.pdf`, pdfBlob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Employee_Reports.zip");
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        <div className="space-y-4">
          <div className="custom-card-bg shadow-md text-white shadow-xl p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">EMPLOYEE ATTENDANCE</h2>
            <div className="mb-4 flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border bg-white text-black"
                />
              </div>

              <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white text-black rounded-lg shadow-lg">
                <thead>
                  <tr>
                    <th className="p-3 text-center">
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Job</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleSelectEmployee(employee.id)}
                        />
                      </td>
                      <td className="p-3">{employee.name}</td>
                      <td className="p-3">{employee.job}</td>
                      <td className="p-3">{employee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-center">
              <button onClick={generatePDFsAndZip} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
