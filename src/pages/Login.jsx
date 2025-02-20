import { useFormik } from 'formik';

const Login = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("Form Data", values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="flex flex-col border p-10 bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl mb-4 text-center">Login</h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <input
            className="p-2 mb-2 bg-gray-700 border rounded text-white"
            type="text"
            name="username"
            placeholder="Username"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          <input
            className="p-2 mb-4 bg-gray-700 border rounded text-white"
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <button type="submit" className="bg-blue-500 p-2 rounded text-white">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login
