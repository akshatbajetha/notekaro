export function MainMenuWelcome() {
  return (
    <div className="notekarosketchfont welcome-screen-decor welcome-screen-decor-hint welcome-screen-decor-hint--menu">
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        viewBox="0 0 41 94"
        className=""
        fill="none"
      >
        <path
          d="M38.5 83.5c-14-2-17.833-10.473-21-22.5C14.333 48.984 12 22 12 12.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m12.005 10.478 7.905 14.423L6 25.75l6.005-15.273Z"
          fill="currentColor"
        ></path>
        <path
          d="M12.005 10.478c1.92 3.495 3.838 7 7.905 14.423m-7.905-14.423c3.11 5.683 6.23 11.368 7.905 14.423m0 0c-3.68.226-7.35.455-13.91.85m13.91-.85c-5.279.33-10.566.647-13.91.85m0 0c1.936-4.931 3.882-9.86 6.005-15.273M6 25.75c2.069-5.257 4.135-10.505 6.005-15.272"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
      <div className="welcome-screen-decor-hint__label font-notekarosketchfont">
        Export, preferences, languages, ...
      </div>
    </div>
  );
}

export function ToolMenuWelcome() {
  return (
    <div className="notekarosketchfont z-[4] welcome-screen-decor welcome-screen-decor-hint welcome-screen-decor-hint--toolbar">
      <div className="welcome-screen-decor-hint__label">
        Pick a tool &amp; Start drawing!
      </div>
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        viewBox="0 0 38 78"
        className=""
        fill="none"
      >
        <path
          d="M1 77c14-2 31.833-11.973 35-24 3.167-12.016-6-35-9.5-43.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m24.165 1.093-2.132 16.309 13.27-4.258-11.138-12.05Z"
          fill="currentColor"
        ></path>
        <path
          d="M24.165 1.093c-.522 3.953-1.037 7.916-2.132 16.309m2.131-16.309c-.835 6.424-1.68 12.854-2.13 16.308m0 0c3.51-1.125 7.013-2.243 13.27-4.257m-13.27 4.257c5.038-1.608 10.08-3.232 13.27-4.257m0 0c-3.595-3.892-7.197-7.777-11.14-12.05m11.14 12.05c-3.837-4.148-7.667-8.287-11.14-12.05"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
    </div>
  );
}

export function HomeWelcome() {
  return (
    <>
      <div className="welcome-screen-center z-[3]">
        <div className="welcome-screen-center__logo notekarosketchfont welcome-screen-decor">
          <div className="NoteKaroSketchLogo is-small">
            <h1 className="brand-title NoteKaroSketchLogo-text font-notekarosketchfont">
              Notekaro
            </h1>
          </div>
        </div>
        <div className="welcome-screen-center__heading welcome-screen-decor font-notekarosketchfont">
          All your data is saved locally in your browser.
        </div>
        <div className="welcome-screen-menu">
          <button type="button" className="welcome-screen-menu-item !hidden">
            <div className="welcome-screen-menu-item__icon">
              <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className=""
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="m9.257 6.351.183.183H15.819c.34 0 .727.182 1.051.506.323.323.505.708.505 1.05v5.819c0 .316-.183.7-.52 1.035-.337.338-.723.522-1.037.522H4.182c-.352 0-.74-.181-1.058-.5-.318-.318-.499-.705-.499-1.057V5.182c0-.351.181-.736.5-1.054.32-.321.71-.503 1.057-.503H6.53l2.726 2.726Z"
                  strokeWidth="1.25"
                ></path>
              </svg>
            </div>
            <div className="welcome-screen-menu-item__text">Open</div>
            <div className="welcome-screen-menu-item__shortcut">Ctrl+O</div>
          </button>
        </div>
      </div>
    </>
  );
}
