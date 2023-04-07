import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success("Hello")}>Click me</button>
    </div>
  );
}
