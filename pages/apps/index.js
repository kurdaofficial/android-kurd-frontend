import React, { useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { fetchAPI } from "../../lib/api";

const index = ({ articles, categories, homepage }) => {
  const router = useRouter();
  const [code, setCode] = useState(0);
  const [showError, setShowError] = useState(false);
  const handleClick = (e) => {
    let app_code = parseInt(code, 10);
    if (Number.isInteger(app_code) && app_code > 0) {
      app_code = Math.abs(app_code);
      e.preventDefault();
      router.push(`/apps/download/${app_code}`);
    } else {
      setShowError(true);
    }
  };

  return (
    <Layout categories={categories}>
      <Seo seo={homepage.seo} />
      <div className="uk-section">
        <div className="uk-container uk-container-xsmall">
          <h1>Download Apps</h1>

          <div className="uk-grid-small uk-flex-center" data-uk-grid="true">
            <div className="uk-width-expand">
              <legend className="uk-legend">Enter the application Code:</legend>
              <div className="uk-margin">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Application Code"
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <button
                className="uk-button uk-button-primary"
                onClick={handleClick}
              >
                Get App ⚡
              </button>
              <hr className="uk-divider-small" />
              <div
                className="uk-alert-danger"
                style={{ visibility: showError ? "visible" : "hidden" }}
              >
                <a className="uk-alert-close"></a>
                <p>Wrong code inserted, Try again with the right code⚠️</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  // Run API calls in parallel
  const [articles, categories, homepage] = await Promise.all([
    fetchAPI("/articles?status=published"),
    fetchAPI("/categories"),
    fetchAPI("/homepage"),
  ]);

  return {
    props: { articles, categories, homepage },
    revalidate: 1,
  };
}
export default index;
