import Layout from "../../components/layout/Layout";
import styles from "./About.module.css";

export default function About() {
  return (
    <Layout>
      <div className={styles.aboutContainer}>
        <div className={styles.aboutContent}>
          <h1 className={styles.aboutTitle}>About Pathfinder</h1>
          <div className={styles.aboutSection}>
            <h2>Our Mission</h2>
            <p>
              Pathfinder is designed to help you create beautiful, interactive roadmaps for any domain.
              Whether you're building learning paths, project timelines, or strategic plans, we provide
              the tools to visualize and share your journey.
            </p>
          </div>
          <div className={styles.aboutSection}>
            <h2>What We Offer</h2>
            <ul className={styles.aboutList}>
              <li>Visual roadmap creation with an intuitive canvas interface</li>
              <li>Interactive node-based system for organizing information</li>
              <li>Easy sharing and collaboration features</li>
              <li>Customizable roadmaps for any use case</li>
            </ul>
          </div>
          <div className={styles.aboutSection}>
            <h2>Get Started</h2>
            <p>
              Start building your first roadmap today. It's free, simple, and designed to help you
              turn your ideas into visual guides that inspire and guide others.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

