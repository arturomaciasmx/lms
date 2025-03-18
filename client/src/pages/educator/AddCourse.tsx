import { useEffect, useRef, useState } from "react";
import { Chapter, ChapterContent, LectureDetail } from "../../types";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";

type ChapterWithState = Chapter & {
  collapsed: boolean;
};

export default function AddCourse() {
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ChapterWithState[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  const [lectureDetails, setLectureDetail] = useState<LectureDetail>({
    lectureTitle: "",
    lectureDuration: 0,
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    // initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  const handleChapter = (action: string, chapterId?: string) => {
    if (action === "add") {
      const title = prompt("Enter chapter name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action: string, chapterId: string, lectureIndex: number) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture: ChapterContent = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetail({
      lectureTitle: "",
      lectureDuration: 0,
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form
        action=""
        className="flex flex-col gap-4 w-full text-gray-500"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-1">
          <p>Course title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p>Course description</p>
          <div ref={editorRef}></div>
        </div>
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course price</p>
            <input
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              value={coursePrice}
              min={0}
              className="outline-none md:py-2.5 w-28 py-2 px-3 rounded border border-gray-500"
              required
              type="number"
            />
          </div>
          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img
                src={assets.file_upload_icon}
                alt="Upload icon"
                className="p-3 bg-blue-500 rounded"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                accept="image/*"
                hidden
              />
              {image && (
                <img
                  src={image ? URL.createObjectURL(image) : ""}
                  alt="thumbnail"
                  className="max-h-10"
                />
              )}
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 justify-between">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(Number(e.target.value))}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 px-3 w-28 rounded border border-gray-500"
            required
          />
        </div>

        {/* adding chapter & lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    src={assets.dropdown_icon}
                    alt="Arow icon"
                    width={14}
                    className={`mr-2 cursor-pointer transition-all ${
                      chapter.collapsed && "-rotate-90"
                    }`}
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1} {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  src={assets.cross_icon}
                  alt="Cross icon"
                  className="cursor-pointer"
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((chapterContent, chapterContentIndex) => (
                    <div
                      key={chapterContentIndex}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {chapterContentIndex + 1} {chapterContent.lectureTitle} -{" "}
                        {chapterContent.lectureDuration} mins -{" "}
                        <a href={chapterContent.lectureUrl}>Link</a> -{" "}
                        {chapterContent.isPreviewFree ? "Free preview" : "Paid"}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt="Cross icon"
                        className="cursor-pointer"
                        onClick={() =>
                          handleLecture("remove", chapter.chapterId, chapterIndex)
                        }
                      />
                    </div>
                  ))}
                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                    onClick={() => handleLecture("add", chapter.chapterId, chapterIndex)}
                  >
                    + Add lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => handleChapter("add")}
          >
            + Add chapter
          </div>
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 cursor-pointer">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                <h2>Add lecture</h2>
                <div className="mb-2">
                  <p>Lecture title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetail({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-2">
                  <p>Lecture duration (Minutes)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetail({
                        ...lectureDetails,
                        lectureDuration: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="mb-2">
                  <p>Lecture url</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetail({ ...lectureDetails, lectureUrl: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <p>Is preview free?</p>
                  <input
                    type="checkbox"
                    className="mt-1 scale-125"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetail({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                </div>

                <button
                  className="w-full bg-blue-400 text-white px-4 py-2 rounded"
                  type="button"
                  onClick={() => addLecture()}
                >
                  Add
                </button>

                <img
                  src={assets.cross_icon}
                  alt="Cross icon"
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 w-4 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
        <button
          className="bg-black text-white w-max py-2 px-8 rounded my-4 cursor-pointer"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
}
