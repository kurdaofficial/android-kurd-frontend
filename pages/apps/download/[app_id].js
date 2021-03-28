import React, { useState } from "react";
import Moment from "react-moment";
import { useRouter } from "next/router";
import Head from "next/head";
function app_id({ data }) {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const handleClick = (e) => {
    if (data.apk_file || data.download_url) {
      var download_link = data.apk_file
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.apk_file.url}`
        : data.download_url;
      e.preventDefault();
      router.push(download_link);
    } else {
      setShowError(true);
    }
  };
  return (
    <>
      <Head>
        <title>{data.title} || Android-Kurd </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="uk-section">
        <div className="uk-container uk-container-xsmall">
          <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
            <div>
              {data.app_icon[0] ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.app_icon[0].url}`}
                  style={{
                    position: "static",
                    height: 100,
                  }}
                />
              ) : (
                <img
                  src={data.icon_url}
                  alt={data.title}
                  width={100}
                  height={100}
                />
              )}
            </div>
            <div className="uk-width-expand">
              <legend className="uk-legend uk-text-primary uk-text-bolder uk-text-large">
                {data.title}
              </legend>
              {data.version && (
                <p className="uk-margin-remove-bottom">
                  Version: {data.version}
                </p>
              )}
              <p className="uk-text-meta uk-margin-remove-top">
                <Moment format="MMM Do YYYY">{data.published_at}</Moment>
              </p>
            </div>
            <div>
              <button
                className="uk-button uk-button-primary uk-button-small"
                onClick={handleClick}
              >
                Download⚡
              </button>
            </div>
          </div>
          <hr />
          {/* slider to be added */}
          <div className="uk-width-expand">
            <div className="uk-margin">
              <p>{data.description}</p>
            </div>

            {/* Alert */}
            <div
              className="uk-alert-danger"
              style={{ visibility: showError ? "visible" : "hidden" }}
            >
              <a className="uk-alert-close"></a>
              <p>Couldn't proceed to the download page⚠️</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get applications
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/applications`
  );
  const applications = await res.json();

  // Get the paths we want to pre-render based on applications
  const paths = applications.map((app) => ({
    params: { app_id: app.app_code },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  var app_id = ctx.params.app_id;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/applications?app_code=${app_id}`
  );
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: { data: data[0] }, // will be passed to the page component as props
  };
}

export default app_id;
