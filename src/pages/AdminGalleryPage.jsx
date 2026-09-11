import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

/* ---------------------------------------------------------------------- */
/* Config / mock data                                                      */
/* ---------------------------------------------------------------------- */

const CURRENT_YEAR = new Date().getFullYear();

const memorials = [
  "Childhood",
  "Wedding & Family",
  "Teaching Years",
  "Others",
];

// const initialImages = [
//   {
//     id: "img-1",
//     memorial: "Eleanor Rose Whitfield",
//     content: "Wedding day, St. Michael's Church",
//     year: 1961,
//     src: "https://picsum.photos/seed/eleanor-wedding-1961/500/500",
//   },
//   {
//     id: "img-2",
//     memorial: "Eleanor Rose Whitfield",
//     content: "Fourth grade classroom, Maplewood Elementary",
//     year: 1978,
//     src: "https://picsum.photos/seed/eleanor-classroom-1978/500/500",
//   },
//   {
//     id: "img-3",
//     memorial: "Eleanor Rose Whitfield",
//     content: "Tending the garden on a September afternoon",
//     year: 2018,
//     src: "https://picsum.photos/seed/eleanor-garden-2018/500/500",
//   },
//   {
//     id: "img-4",
//     memorial: "Robert James Whitfield",
//     content: "Fishing at Folly Beach with the grandchildren",
//     year: 2005,
//     src: "https://picsum.photos/seed/robert-fishing-2005/500/500",
//   },
// ];

const schema = Yup.object({
  memorial: Yup.string().required("Choose which memorial this belongs to"),
  content: Yup.string()
    .trim()
    .min(10, "Give a little more detail")
    .max(1500, "Keep it under 160 characters")
    .required("Describe the photograph"),
  year: Yup.number()
    .typeError("Enter a year")
    .integer("Enter a whole year")
    .min(1900, "Year seems too early")
    .max(CURRENT_YEAR, `Year can't be after ${CURRENT_YEAR}`)
    .required("Enter a year"),
});

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_MB = 10;

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // const [initialImages, setInitialImages] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const isEditing = editingId !== null;

  const getGallery = async () => {
    const res = await api.get('/upload_image/photos/')
    console.log('Get response', res)
    setImages(res?.data?.results)
  }

  const sendAPI = async (url, payload) => {
    if (isEditing) {
      return await api.patch(url, payload)
    }
      return await api.post(url, payload)

  }
  
  const submitUpload = async (values) => {
      // const res = await api.get('api/upload_image/')
      // console.log('Get response', res)
      
    try {
      const formData = new FormData();

      formData.append("memorial", values.memorial);
      formData.append("content", values.content);
      formData.append("year", values.year);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }



      const url = isEditing
        ? `/upload_image/photos/${editingId}/`
        : "/upload_image/photos/";

      const method = isEditing ? "PATCH" : "POST";

      // const response = await fetch(url, {
      //   method,
      //   body: formData,
      // });

      // const data = await response.json();

      const response = await sendAPI(url, formData)
    console.log("Upload response:", response);
    console.log("Upload response status:", response.status);
    console.log("Upload response status:", response.status != 200);
    console.log("Upload response status:", response.status != 201);
    console.log("Upload response status:", response.status != 200 || response.status != 201);

      if (response.status != 200 && response.status != 201) {
        throw new Error(
          // data.detail ||
          // data.error ||
          "Upload failed"
        );
      }

      
      if (isEditing) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === editingId
              ? {
                  ...img,
                  memorial: values.memorial,
                  content: values.content,
                  year: Number(values.year),
                  src: filePreview || img.src,
                }
              : img
          )
        );
        toast.success("Photograph updated");
      } else {
        setImages((prev) => [
          {
            id: `img-${Date.now()}`,
            memorial: values.memorial,
            content: values.content,
            year: Number(values.year),
            src: filePreview,
          },
          ...prev,
        ]);
        toast.success("Photograph added to the gallery");
      }
      getGallery()
    } catch (error) {

    console.error(error);

    toast.error(
      error.message || "Something went wrong"
    );

  } finally {

    setSubmitting(false);
  }


    }


  const formik = useFormik({
    initialValues: { memorial: "", content: "", year: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      if (!isEditing && !filePreview) {
        setFileError("Add a photograph to continue");
        return;
      }
      setSubmitting(true);
      
      // Simulated request — replace with the real upload call.
      // await new Promise((r) => setTimeout(r, 700));
      await submitUpload(values)

      resetForm();
      setFilePreview(null);
      setFileError("");
      setEditingId(null);
      setSubmitting(false);
    },
  });

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Use a JPG, PNG, or WEBP file");
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`Keep files under ${MAX_FILE_MB}MB`);
      return;
    }
    setFileError("");
    // setFilePreview(URL.createObjectURL(file));

  setSelectedFile(file);

  setFilePreview(URL.createObjectURL(file));
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const startEdit = (image) => {
    setEditingId(image.id);
    setFilePreview(image.src);
    setFileError("");
    formik.setValues({
      memorial: image.memorial,
      content: image.content,
      year: String(image.year),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFilePreview(null);
    setFileError("");
    formik.resetForm();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const confirmDelete = async () => {

  try {
    const response = await api.delete(`/upload_image/photos/${confirmDeleteId}/`)
 
    console.log('delete response', response)

    if (response.status != 204) {
      throw new Error("Failed to delete photograph");
    }

    setImages((prev) =>
      prev.filter(
        (img) => img.id !== confirmDeleteId
      )
    );

    if (editingId === confirmDeleteId) {
      cancelEdit();
    }

    toast.success("Photograph removed");

  } catch (error) {

    console.error(error);

    toast.error(
      "Could not remove photograph"
    );

  } finally {

    setConfirmDeleteId(null);
  }
};

useEffect(() =>{
  getGallery()
}, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return images;
    const q = search.toLowerCase();
    return images.filter(
      (img) =>
        img.memorial.toLowerCase().includes(q) ||
        img.content.toLowerCase().includes(q) ||
        String(img.year).includes(q)
    );
  }, [images, search]);

  return (
    <div className="  text-[#12141A] font-[Inter,sans-serif]">
      {/* <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      /> */}

      {/* ---------------- Header ---------------- */}

          <div className="relative w-full max-w-xs hidden sm:block">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3BD] text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by memorial, caption, year"
              className="w-full h-10 rounded-full bg-white border border-[#E4E6EC] pl-9 pr-4 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            />
          </div>

      <div className=" py-10 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* ---------------- Upload form ---------------- */}
        <form
          onSubmit={formik.handleSubmit}
          className="lg:sticky lg:top-24 bg-white rounded-2xl border border-[#E4E6EC] shadow-[0_1px_2px_rgba(18,20,26,0.04)] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold">
              {isEditing ? "Edit photograph" : "Add a photograph"}
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs text-[#8B8F9A] hover:text-[#12141A]"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
              dragActive
                ? "border-[#4F46E5] bg-[#4F46E5]/5"
                : "border-[#E4E6EC] hover:border-[#C7CAD6]"
            }`}
          >
            {filePreview ? (
              <div className="relative aspect-[4/3]">
                <img src={filePreview} alt="Selected preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <span className="text-white text-xs flex items-center gap-1.5">
                    <i className="pi pi-refresh" /> Replace photo
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] flex flex-col items-center justify-center gap-2 text-center px-6">
                <div className="w-11 h-11 rounded-full bg-[#4F46E5]/10 flex items-center justify-center">
                  <i className="pi pi-cloud-upload text-[#4F46E5]" />
                </div>
                <p className="text-sm text-[#3A3D46]">
                  <span className="text-[#4F46E5] font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-[#8B8F9A]">JPG, PNG or WEBP · up to {MAX_FILE_MB}MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
          {fileError && <p className="text-xs text-red-500 mt-2">{fileError}</p>}

          {/* memorial */}
          <label className="block text-xs font-medium text-[#5B5F6B] mt-5 mb-1.5">
            Memorial
          </label>
          <select
            name="memorial"
            value={formik.values.memorial}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-11 rounded-lg bg-[#F7F8FA] border border-[#E4E6EC] px-3 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
          >
            <option value="" disabled>
              Choose a memorial
            </option>
            {memorials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {formik.touched.memorial && formik.errors.memorial && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.memorial}</p>
          )}

          {/* Content */}
          <label className="block text-xs font-medium text-[#5B5F6B] mt-4 mb-1.5">
            Caption
          </label>
          <textarea
            name="content"
            rows={3}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="What's happening in this photo?"
            className="w-full rounded-lg bg-[#F7F8FA] border border-[#E4E6EC] px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 resize-none"
          />
          <div className="flex justify-between mt-1">
            {formik.touched.content && formik.errors.content ? (
              <p className="text-xs text-red-500">{formik.errors.content}</p>
            ) : (
              <span />
            )}
            <span className="text-[11px] text-[#B0B3BD]">
              {formik.values.content.length}/1500
            </span>
          </div>

          {/* Year */}
          <label className="block text-xs font-medium text-[#5B5F6B] mt-4 mb-1.5">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={formik.values.year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={String(CURRENT_YEAR)}
            className="w-full h-11 rounded-lg bg-[#F7F8FA] border border-[#E4E6EC] px-3 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
          />
          {formik.touched.year && formik.errors.year && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.year}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 mt-6 rounded-lg bg-[#B4652F] hover:bg-[#8A7F6A] disabled:opacity-60 text-white text-sm font-medium flex items-center justify-center gap-2"
          >
            {submitting ? (
              <i className="pi pi-spin pi-spinner" />
            ) : (
              <i className={`pi ${isEditing ? "pi-check" : "pi-plus"}`} />
            )}
            {isEditing ? "Save changes" : "Add to gallery"}
          </button>
        </form>

        {/* ---------------- Image list ---------------- */}
        <div>
          <div className="relative mb-4 sm:hidden">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3BD] text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by memorial, caption, year"
              className="w-full h-10 rounded-full bg-white border border-[#E4E6EC] pl-9 pr-4 text-sm outline-none focus:border-[#4F46E5]"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E4E6EC] py-20 text-center">
              <i className="pi pi-images text-2xl text-[#C7CAD6] mb-3 block" />
              <p className="text-sm text-[#8B8F9A]">No photographs match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((image) => (
                <div
                  key={image.id}
                  className={`group bg-white rounded-2xl border overflow-hidden ${
                    editingId === image.id ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/15" : "border-[#E4E6EC]"
                  }`}
                >
                  <div className="relative aspect-[4/3]">
                    <img src={image.src} alt={image.content} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 text-white text-[11px] px-2.5 py-1">
                      {image.year}
                    </span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => startEdit(image)}
                        className="w-9 h-9 rounded-full bg-white text-[#12141A] flex items-center justify-center hover:bg-[#F0F0F5]"
                        aria-label="Edit photograph"
                      >
                        <i className="pi pi-pencil text-xs" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(image.id)}
                        className="w-9 h-9 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-50"
                        aria-label="Delete photograph"
                      >
                        <i className="pi pi-trash text-xs" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium text-[#4F46E5] mb-1">{image.memorial}</p>
                    <p className="text-sm text-[#3A3D46] leading-snug line-clamp-2">{image.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Delete confirm ---------------- */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <i className="pi pi-trash text-red-500" />
            </div>
            <h3 className="text-base font-semibold mb-1.5">Remove this photograph?</h3>
            <p className="text-sm text-[#8B8F9A] mb-6">
              This can't be undone. It will no longer appear on the memorial page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 h-10 rounded-lg border border-[#E4E6EC] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="light" />
    </div>
  );
}
