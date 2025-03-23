import { useEffect, useState } from "react";
import { StudentEnrolled } from "../../types";
import Loading from "../../components/student/Loading";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function StudentsEnrolled() {
  const { backendUrl, getToken, isEducator } = useAppContext();
  const [enrolledStudents, setEnrolledStudents] = useState<StudentEnrolled[] | null>(
    null
  );

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/enrolled-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8">
      <div className="w-full">
        <h2 className="pb-4">Students enrolled</h2>
        <div className="flex flex-col items-center  w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed md:table-auto w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">#</th>
                <th className="px-4 py-3 font-semibold truncate">Student name</th>
                <th className="px-4 py-3 font-semibold truncate">Course title</th>
                <th className="px-4 py-3 font-semibold truncate">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {enrolledStudents.map((item, i) => (
                <tr key={item.student._id} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 truncate">#{i + 1}</td>
                  <td className="md:px-4 md:pl-2 py-3 flex items-center space-x-3">
                    <img
                      className="w-8 rounded-full"
                      src={item.student.imageUrl}
                      alt={item.student.name}
                    />
                    <span className="px-4 py-3 truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 truncate">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
