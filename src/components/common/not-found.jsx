import { useState, useEffect } from "react";
import { Button, Typography, Space } from "antd";
import {
  HomeOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const FloatingOrb = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(60px)",
      opacity: 0.12,
      animation: "float 8s ease-in-out infinite",
      ...style,
    }}
  />
);

const GlitchText = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          fontSize: "clamp(100px, 18vw, 180px)",
          fontWeight: 900,
          fontFamily: "'Georgia', serif",
          letterSpacing: "-8px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "block",
          lineHeight: 1,
          position: "relative",
          zIndex: 2,
          transition: "transform 0.1s",
          transform: glitch ? "translate(2px, -1px)" : "none",
        }}
      >
        404
      </span>
      {glitch && (
        <>
          <span
            style={{
              fontSize: "clamp(100px, 18vw, 180px)",
              fontWeight: 900,
              fontFamily: "'Georgia', serif",
              letterSpacing: "-8px",
              color: "#4096ff",
              position: "absolute",
              top: "-2px",
              left: "3px",
              opacity: 0.5,
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            404
          </span>
          <span
            style={{
              fontSize: "clamp(100px, 18vw, 180px)",
              fontWeight: 900,
              fontFamily: "'Georgia', serif",
              letterSpacing: "-8px",
              color: "#ff4d4f",
              position: "absolute",
              top: "2px",
              left: "-3px",
              opacity: 0.5,
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            404
          </span>
        </>
      )}
    </div>
  );
};

const CompassAnimation = () => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => {
        const target = 315;
        const diff = target - (prev % 360);
        return prev + diff * 0.05 + Math.sin(Date.now() / 800) * 1.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: "2px solid #e6e9f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        margin: "0 auto 32px",
        position: "relative",
      }}
    >
      {/* Compass markings */}
      {["N", "E", "S", "W"].map((dir, i) => (
        <span
          key={dir}
          style={{
            position: "absolute",
            fontSize: 9,
            fontWeight: 700,
            color: dir === "N" ? "#ff4d4f" : "#8c9ab0",
            fontFamily: "monospace",
            top: i === 0 ? 6 : i === 2 ? "auto" : "50%",
            bottom: i === 2 ? 6 : "auto",
            left: i === 3 ? 6 : i === 1 ? "auto" : "50%",
            right: i === 1 ? 6 : "auto",
            transform:
              i === 0 || i === 2 ? "translateX(-50%)" : "translateY(-50%)",
          }}
        >
          {dir}
        </span>
      ))}
      {/* Needle */}
      <div
        style={{
          width: 2,
          height: 36,
          position: "absolute",
          transform: `rotate(${angle}deg)`,
          transition: "transform 0.05s linear",
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "50%",
            background: "#ff4d4f",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "50%",
            background: "#8c9ab0",
            borderRadius: "0 0 2px 2px",
          }}
        />
      </div>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#1a1a2e",
          position: "absolute",
          zIndex: 2,
        }}
      />
    </div>
  );
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        // minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', serif",
        position: "relative",
        overflow: "hidden",
        // padding: "24px",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.1; }
        }
        .action-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(64, 150, 255, 0.25) !important;
        }
        .action-btn-ghost:hover {
          transform: translateY(-2px) !important;
          background: #f0f5ff !important;
        }
        .action-btn, .action-btn-ghost {
          transition: all 0.2s ease !important;
        }
      `}</style>

      {/* Background orbs */}
      <FloatingOrb
        style={{
          width: 500,
          height: 500,
          background: "#4096ff",
          top: -100,
          right: -150,
          animationDelay: "0s",
        }}
      />
      <FloatingOrb
        style={{
          width: 400,
          height: 400,
          background: "#722ed1",
          bottom: -120,
          left: -100,
          animationDelay: "3s",
        }}
      />
      <FloatingOrb
        style={{
          width: 300,
          height: 300,
          background: "#13c2c2",
          top: "40%",
          left: "60%",
          animationDelay: "6s",
        }}
      />

      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(26,26,46,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,26,46,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "subtlePulse 6s ease-in-out infinite",
        }}
      />

      {/* Main card */}
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "56px 64px",
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.8) inset",
          border: "1px solid rgba(255,255,255,0.9)",
          position: "relative",
          zIndex: 10,
          animation: "fadeInUp 0.6s ease both",
        }}
      >
        {/* Compass */}
        <div
          style={{
            animationDelay: "0.1s",
            animation: "fadeInUp 0.6s ease both",
          }}
        >
          <CompassAnimation />
        </div>

        {/* 404 number */}
        <div
          style={{
            marginBottom: 8,
            animation: "fadeInUp 0.6s ease 0.15s both",
          }}
        >
          <GlitchText />
        </div>

        {/* Divider line */}
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #4096ff, transparent)",
            margin: "0 auto 28px",
            width: 120,
            borderRadius: 2,
            animation: "fadeInUp 0.6s ease 0.2s both",
          }}
        />

        {/* Heading */}
        <Title
          level={3}
          style={{
            margin: "0 0 12px",
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            color: "#1a1a2e",
            fontSize: 22,
            letterSpacing: "-0.3px",
            animation: "fadeInUp 0.6s ease 0.25s both",
          }}
        >
          Lost in the void
        </Title>

        {/* Subtext */}
        <Text
          style={{
            color: "#8c9ab0",
            fontSize: 15,
            lineHeight: 1.7,
            display: "block",
            marginBottom: 40,
            fontFamily: "system-ui, -apple-system, sans-serif",
            animation: "fadeInUp 0.6s ease 0.3s both",
          }}
        >
          The page you're looking for has drifted off the map.
          <br />
          Let's get you back on course.
        </Text>

        {/* Buttons */}
        <Space
          direction="vertical"
          size={12}
          style={{
            width: "100%",
            animation: "fadeInUp 0.6s ease 0.35s both",
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            className="action-btn"
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "system-ui, -apple-system, sans-serif",
              background: "linear-gradient(135deg, #4096ff 0%, #1677ff 100%)",
              border: "none",
              boxShadow: "0 4px 16px rgba(64, 150, 255, 0.3)",
              letterSpacing: "0.2px",
            }}
            onClick={() => navigate("/home")}
          >
            Go back home
          </Button>
        </Space>

        {/* Footer note */}
        <Text
          style={{
            display: "block",
            marginTop: 32,
            fontSize: 12,
            color: "#c0c8d6",
            fontFamily: "monospace",
            letterSpacing: "0.5px",
            animation: "fadeInUp 0.6s ease 0.4s both",
          }}
        >
          ERROR_CODE: PAGE_NOT_FOUND · STATUS: 404
        </Text>
      </div>
    </div>
  );
}
