import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { login } from "../core/_requests";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useAuth } from "../core/Auth";
import { AuthModel } from "../core/_models";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Username is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
});

const initialValues = {
  username: "enderson2730142@gmail.com",
  password: "Gomez2730!",
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const { saveAuth, setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const { data } = await login(values.username, values.password);
        const authData: AuthModel = {
          token: data.token,
          usuario: data.usuario,
        };
        saveAuth(authData);
        setCurrentUser(data.usuario);
        Cookies.set("AuthToken", authData.token, { expires: 7 });
        Cookies.set("CurrentUser", JSON.stringify(authData.usuario), {
          expires: 7,
        });
      } catch (error) {
        console.error(error);
        saveAuth(undefined);
        setStatus("Contraseña o correo invalidos");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">Entrar</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          Conectate con tus redes sociales
        </div>
      </div>
      {/* begin::Heading */}

      {/* begin::Login options */}
      <div className="row g-3 mb-9">
        {/* begin::Col */}
        <div className="col-md-6">
          {/* begin::Google link */}
          <a
            href="#"
            className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
          >
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/brand-logos/google-icon.svg")}
              className="h-15px me-3"
            />
            Entra con Google
          </a>
          {/* end::Google link */}
        </div>
        {/* end::Col */}

        {/* begin::Col */}
        <div className="col-md-6">
          {/* begin::Google link */}
          <a
            href="#"
            className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
          >
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/brand-logos/apple-black.svg")}
              className="theme-light-show h-15px me-3"
            />
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/brand-logos/apple-black-dark.svg")}
              className="theme-dark-show h-15px me-3"
            />
            Entra con Apple
          </a>
          {/* end::Google link */}
        </div>
        {/* end::Col */}
      </div>
      {/* end::Login options */}

      {/* begin::Separator */}
      <div className="separator separator-content my-14">
        <span className="w-125px text-gray-500 fw-semibold fs-7">
          O usa tu correo
        </span>
      </div>
      {/* end::Separator */}

      {formik.status ? (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      ) : (
        <div className="mb-10 bg-light-info p-8 rounded">
          <div className="text-info">
            Use account <strong>admin</strong> and password{" "}
            <strong>demo</strong> to continue.
          </div>
        </div>
      )}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">
          Username
        </label>
        <input
          placeholder="Username"
          {...formik.getFieldProps("username")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.username && formik.errors.username },
            {
              "is-valid": formik.touched.username && !formik.errors.username,
            }
          )}
          type="text"
          name="username"
          autoComplete="off"
        />
        {formik.touched.username && formik.errors.username && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          Contraseña
        </label>
        <input
          type="password"
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.password && formik.errors.password,
            },
            {
              "is-valid": formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        {/* begin::Link */}
        <Link to="/auth/forgot-password" className="link-primary">
          ¿Olvidaste tu contraseña ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Continuar</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Espera
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className="text-gray-500 text-center fw-semibold fs-6">
        No eres un miembro aun?{" "}
        <Link to="/auth/registration" className="link-primary">
          Registrate
        </Link>
      </div>
    </form>
  );
}