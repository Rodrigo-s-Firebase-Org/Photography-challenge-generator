import SkeletonBlock from "../SkeletonBlock/SkeletonBlock";
import styles from "./PageLoader.module.css";
import { motion } from "framer-motion";
import { fade } from "../../../animations/fade";

export default function SkeletonProperties() {
    return (
        <motion.div
            variants={fade}
            exit="exit"
            initial="initial"
            animate="animate"
            key="skeleton"
            className={`h-screen w-screen flex justify-between pt-16 ${styles.skeleton}`}>
            <div className={`${styles.skeleton_aside} w-96 flex flex-col justify-start items-start py-6 px-12 gap-y-6 border-r-2 border-neutral-100`}>
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-full h-48 bg-slate-100" />
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-1/2 h-9 bg-slate-100" />
            </div>
            <div className={`${styles.skeleton_dashboard} flex flex-col gap-y-6 px-12 py-6`}>
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-1/4 h-9 bg-slate-100" />
                <SkeletonBlock className="w-1/2 h-48 bg-slate-100" />
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-1/2 h-9 bg-slate-100" />
                <SkeletonBlock className="w-2/3 h-48 bg-slate-100" />
            </div>
        </motion.div>
    );
};
