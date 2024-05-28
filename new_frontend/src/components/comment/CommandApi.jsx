//mock API ไม่ใช้แล้ว
// export const getComments = async () => {
//     return [
//       {
//         id: "1",
//         body: "First comment",
//         username: "Test",
//         userId: "1",
//         createdAt: "2023-08-16T23:00:33.010+02:00",
//       },
//       {
//         id: "2",
//         body: "Second comment",
//         username: "Test2",
//         userId: "2",
//         createdAt: "2023-08-16T23:00:33.010+02:00",
//       },
//       {
//         id: "3",
//         body: "First comment first child",
//         username: "Test2",
//         userId: "2",
//         createdAt: "2023-08-16T23:00:33.010+02:00",
//       },
//       {
//         id: "4",
//         body: "Second comment second child",
//         username: "Test2",
//         userId: "2",
//         createdAt: "2023-08-16T23:00:33.010+02:00",
//       },
//     ];
//   };
  
//   export const createComment = async (text = null) => {
//     return {
//       id: Math.random().toString(36).substr(2, 9),
//       body: text,
//       userId: "1",
//       username: "John",
//       createdAt: new Date().toISOString(),
//     };
//   };
  
//   export const updateComment = async (text) => {
//     return { text };
//   };
  
//   export const deleteComment = async () => {
//     return {};
//   };