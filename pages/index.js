import dynamic from "next/dynamic";

// and <React.Suspense>, or react-loadable

// const MfeButton = dynamic(
//   async () => {
//     await new Promise((res) => setTimeout(res, 1500));
//     return await import("teamDs/Button");
//   },
//   {
//     ssr: false,
//     loading: ({ error }) => {
//       if (error) {
//         return <p>{error.message}</p>;
//       }
//       return <p>loading</p>;
//     },
//   }
// );

const dsComponents = {
  Header: dynamic(() => import("teamDs/Header"), {
    ssr: false,
    // loading: () => <Skeleton></Skeleton>,
  }),
};


export default function Home() {
  return (
    <div>
      <dsComponents.Header
        text='Time VT'
      />
    </div>
  )
}
