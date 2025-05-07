import type { LinksFunction } from "@remix-run/node"; // or @remix-run/cloudflare, @remix-run/deno etc.
import React, { useEffect, useRef } from "react";
import stylesUrl from "./UahConnectSection.css";

// --- Placeholder Icon Components ---
// IMPORTANT: Replace these with your actual Icon1 and Icon2 components
// Ensure your actual Icon components accept a 'style' prop if needed.

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // any other props your icons might need
  pathRef?: React.RefObject<SVGPathElement>; // Add ref for the path element
}

const Icon1: React.FC<IconProps> = ({ pathRef, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 205.531 15.5188" // Adjusted to match style usage
    fill="none"
    stroke="currentColor" // Will be overridden by inline style
    {...props}
  >
    {/* Path with increased stroke width and round ends */}
    <path
      ref={pathRef}
      d="M1 7.7594 C 50 14.5188, 150 1, 204.531 7.7594"
      strokeWidth="3"
      strokeLinecap="round"
      className="connect-line"
    />
  </svg>
);

const Icon2: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    {/* Replace with actual path data for Icon2 */}
    <circle cx="10" cy="10" r="8" />
    <polyline points="7 10 9 12 13 8" />
  </svg>
);
// --- End Placeholder Icon Components ---

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export function UahConnectSection() {
  // Reference to the SVG element
  const lineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Set up intersection observer
  useEffect(() => {
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When the element is visible
          if (entry.isIntersecting && lineRef.current) {
            console.log("Element is visible, adding animate class");
            // Add the animation class
            lineRef.current.classList.add("animate");
            // Unobserve after animation is triggered
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1, // Trigger when at least 10% is visible
      }
    );
    
    // Start observing the container element
    if (containerRef.current) {
      console.log("Starting to observe container");
      observer.observe(containerRef.current);
    }
    
    // Clean up
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  return (
    // Wrapper div with a class to scope the styles from UahConnectSection.css
    <div className="uah-connect-section-wrapper">
      <div
        style={{
          position: "relative",
          color: "rgb(23, 23, 23)",
          backgroundColor: "rgb(255, 255, 255)",
          // content: "normal", // 'content' CSS property is not typically used on regular divs like this
          pointerEvents: "auto",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
          width: "100%",
          minHeight: "954.7px", // Using minHeight for flexibility
          paddingBlockStart: "72px",
          paddingBlockEnd: "0px",
          fontSize: "16px",
          lineHeight: "normal",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <span
          style={{
            position: "absolute",
            color: "rgb(23, 23, 23)",
            backgroundColor: "rgb(255, 255, 255)",
            content: '""', // This 'content' makes sense for a pseudo-element like effect
            pointerEvents: "none",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
            // width: "1520.8px", // Often better to let it be 100% or controlled by parent
            // height: "978.938px",// Often better to let it be 100% or controlled by parent
            width: "100%",
            height: "100%",
            paddingBlockStart: "0px",
            paddingBlockEnd: "0px",
          }}
        ></span>

        <div
          style={{
            position: "relative",
            paddingInlineStart: "20px",
            paddingInlineEnd: "20px",
            margin: "0px",
          }}
        >
          <div
            style={{
              display: "grid",
              alignItems: "flex-start",
              rowGap: "0px",
              columnGap: "0px",
              // Responsive considerations might be needed for this fixed grid
              gridTemplateColumns: "minmax(auto, 559.2px) minmax(auto, 745.6px)",
              paddingInlineStart: "36px",
              paddingInlineEnd: "36px",
              maxWidth: "1900px", // Match the width of UahCollectionLine
              margin: "0 auto", // Center the grid
            }}
          >
            <div
              style={{
                position: "relative",
                display: "grid", // Consider 'flex' and 'flex-direction: column' if items are stacked
                textAlign: "start",
                zIndex: 1, // Use number for zIndex
                flexDirection: "row",
                rowGap: "32px",
                columnGap: "32px",
                alignItems: "flex-end", //This aligns items at the bottom of the container
                justifyContent: "space-between", // This might be complex with 'grid'
                lineHeight: "16px",
                marginBlockEnd: "0px",
                paddingInlineEnd: "60px",
                paddingInlineStart: "60px",
              }}
            >
              <div
                ref={containerRef}
                style={{ display: "grid", rowGap: "16px", columnGap: "16px" }}
              >
                <h2
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontStyle: "normal",
                    fontWeight: 700,
                    letterSpacing: "-1.55197px",
                    lineHeight: "51.7325px",
                    textTransform: "none",
                    color: "rgb(23, 23, 23)",
                    wordBreak: "break-word",
                    fontSize: "51.7325px",
                    margin: "0px",
                  }}
                >
                  UAH{" "}
                  <em
                    style={{
                      position: "relative",
                      display: "inline-block",
                      fontStyle: "italic", // em default
                    }}
                  >
                    Connect
                    <Icon1
                      pathRef={lineRef}
                      style={{
                        width: "205.531px",
                        height: "15.5188px",
                        zIndex: -1,
                        position: "absolute",
                        insetBlockStart: "46.5563px",
                        insetInlineStart: "0px",
                        stroke: "rgb(41, 98, 255)",
                        // insetBlockEnd: "-10.3438px", // top/left/width/height usually define position/size
                      }}
                    />
                  </em>
                </h2>
              </div>
              <p
                style={{
                  // flexGrow: 0, // Not applicable if parent is not flex
                  // flexShrink: 0,
                  // flexBasis: "auto",
                  marginBlockStart: "12px",
                  margin: "12px 0px 0px 0px",
                }}
              >
                <a
                  href="#" // Add a meaningful href or handle navigation programmatically
                  role="link"
                  // aria-disabled="true" // if it's a link, it shouldn't be disabled unless there's a reason
                  style={{
                    color: "rgb(23, 23, 23)",
                    cursor: "pointer",
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    lineHeight: "15.4216px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15.4216px",
                    fontWeight: 500,
                    textTransform: "none",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    boxShadow: "rgba(168, 232, 226, 0) 0px 0px 0px 0px",
                    maxHeight: "60px",
                    height: "56.8625px",
                    // backdropFilter: "blur(12px)", // Support varies, ensure fallback
                    transitionProperty: "box-shadow, opacity",
                    transitionDuration: "0.5s, 0.3s",
                    transitionTimingFunction:
                      "cubic-bezier(0.3, 1, 0.3, 1), cubic-bezier(0.7, 0, 0.3, 1)",
                    // transitionDelay: "0s, 0s",
                    // transitionBehavior: "normal, normal", // Not standard CSS properties
                    border: "0px none rgb(23, 23, 23)",
                    borderRadius: "60px",
                    padding: "18.432px 26px",
                    textDecoration: "none",
                  }}
                  // For hover effects, consider using CSS classes and :hover pseudo-selector
                  // or React state for more complex interactions
                >
                  <span // This span seems to be for a hover animation effect
                    style={{
                      display: "block",
                      width: "232.2px",
                      height: "113.725px",
                      insetBlockStart: "-28.4312px",
                      insetInlineStart: "-38.7px",
                      position: "absolute",
                      transform: "translateY(-86.431px)", // Simpler transform
                      backgroundColor: "rgb(23, 23, 23)",
                      transitionProperty: "background-color, transform", // Added transform for potential animation
                      transitionDuration: "0.5s",
                      transitionTimingFunction: "cubic-bezier(0.3, 1, 0.3, 1)",
                      // transitionDelay: "0s",
                      borderRadius: "50%",
                      // This element will likely be hidden due to parent's overflow:hidden
                      // unless its transform is changed on hover.
                    }}
                  ></span>

                  <span // Text content + Icon
                    style={{
                      alignItems: "center",
                      display: "flex",
                      rowGap: "12px",
                      columnGap: "12px",
                      color: "rgb(23, 23, 23)",
                      transitionProperty: "color",
                      transitionDuration: "0.5s",
                      transitionTimingFunction: "cubic-bezier(0.3, 1, 0.3, 1)",
                      // transitionBehavior: "normal", // Not standard
                      transitionDelay: "0.1s",
                      position: "relative",
                      pointerEvents: "none",
                      justifyContent: "center",
                      // width: "102.8px", // Auto width is usually better
                      // height: "20px",   // Auto height is usually better
                      zIndex: 1,
                    }}
                  >
                    Our Story
                    <Icon2 style={{ width: "20px", height: "20px", marginLeft: "8px" }} />
                  </span>

                  <span // Border element
                    style={{
                      // color: "rgb(23, 23, 23)", // Not needed for a border span
                      position: "absolute",
                      display: "block",
                      // alignItems: "normal", // Not applicable to span
                      // justifyContent: "normal", // Not applicable to span
                      // overflowX: "visible", // Not typically needed here
                      // overflowY: "visible",
                      // lineHeight: "15.4216px", // Not needed for border
                      // fontSize: "15.4216px",   // Not needed for border
                      // backgroundColor: "rgba(0, 0, 0, 0)", // Default
                      // boxShadow: "none", // Default
                      // maxHeight: "none", // Default
                      inset: 0, // Covers the parent
                      // backdropFilter: "none", // Default
                      transitionProperty: "border",
                      transitionDuration: "0.5s",
                      transitionTimingFunction: "cubic-bezier(0.3, 1, 0.3, 1)",
                      // transitionDelay: "0s",
                      // transitionBehavior: "normal", // Not standard
                      border: "2px solid rgb(23, 23, 23)",
                      borderRadius: "60px",
                      // padding: "0px", // Not needed for border
                      // textDecoration: "none", // Not applicable
                    }}
                  ></span>
                </a>
              </p>
            </div>
            <div
              style={{
                position: "relative",
                textAlign: "start",
                zIndex: 1,
                paddingInlineStart: "60px",
                paddingInlineEnd: "60px",
              }}
            >
              <div style={{ lineHeight: "25.854px", fontSize: "16.1587px" }}>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontStyle: "normal",
                    fontWeight: 700,
                    letterSpacing: "-0.9px",
                    lineHeight: "42px",
                    textTransform: "none",
                    color: "rgb(23, 23, 23)",
                    wordBreak: "break-word",
                    fontSize: "30px",
                    marginBlockStart: "48px",
                    marginBlockEnd: "20px",
                    // margin: "48px 0px 20px 0px", // Redundant with block start/end
                  }}
                >
                  UAH Connect: Die zentrale Plattform für
                  Automatisierungstechnik
                </h3>
                <p
                  style={{
                    marginBlockStart: "0px",
                    marginBlockEnd: "18px",
                    // margin: "0px 0px 18px 0px", // Redundant
                  }}
                >
                  UAH Connect bietet Herstellern einen einfachen und direkten
                  Zugang zur Welt der Automatisierung. Unsere Plattform
                  verbindet Sie mit führenden Spezialisten und Lösungen aus
                  allen Bereichen der Fertigungstechnik – von einzelnen
                  Komponenten bis hin zu vollständigen Turnkey-Systemen.
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Was Sie bei UAH Connect finden:</strong>
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Komponenten:</strong>
                  Roboter, Antriebstechnik, Greiftechnik, Endeffektoren,
                  Sensorik, Messtechnik, Kameratechnik und mehr
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Systemtechnik und Prozesstechnik:</strong>
                  Fördertechnik, Zuführtechnik, Schraubtechnik,
                  Reinigungstechnik und spezialisierte Prozesssysteme
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Software:</strong>
                  SCADA & Prozessvisualisierung, MES & Produktionsmanagement,
                  IIoT & Datenanalyse, Steuerungssoftware und KI-Lösungen
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Maschinenbauer und Systemanbieter:</strong>
                  Montage- & Fügetechnik-Experten, Prüf- &
                  Messtechnik-Spezialisten und maßgeschneiderte
                  Automatisierungslösungen
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>
                    Branchenlösungen & Turnkey Systeme:
                  </strong>
                  Komplettlösungen für Automobil, Pharma & Life Science,
                  Lebensmittel & Getränke, Elektronikfertigung und mehr
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Dienstleistungen:</strong>
                  Maschinenverlagerung, Bauleitung/Onsite Management,
                  Elektroprojektierung, Mechanische Konstruktion und
                  Programmierung
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "18px",
                    // margin: "18px 0px 18px 0px",
                  }}
                >
                  <strong>Education:</strong>
                  Spezialisierte Schulungen in Robotik, SPS-Systemen und
                  Bildverarbeitungstechnologien
                </p>
                <p
                  style={{
                    marginBlockStart: "18px",
                    marginBlockEnd: "0px",
                    // margin: "18px 0px 0px 0px",
                  }}
                >
                  Über UAH Connect haben Sie direkten Zugriff auf ein
                  umfassendes Netzwerk von Automatisierungsexperten und
                  -lösungen – alles kombiniert mit herausragendem, lokalem
                  Service, der individuell auf Ihre Anforderungen zugeschnitten
                  ist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}