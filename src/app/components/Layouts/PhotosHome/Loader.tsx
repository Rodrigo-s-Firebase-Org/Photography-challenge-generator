import SkeletonBlock from "../../Loader/SkeletonBlock/SkeletonBlock"
import styles from "./PhotosHome.module.css";
import { motion } from "framer-motion";
import { fade } from "../../../animations/fade";

export default function Loader() {
    return (
        <motion.div
            variants={fade}
            exit="exit"
            initial="initial"
            animate="animate"
            key="skeleton"
            className={`h-screen w-screen flex justify-between pt-16 ${styles.loader_layout}`}>
            <div className={`w-full flex flex-col justify-start items-start py-6 px-12 gap-y-6 border-neutral-100`}>
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-full h-48 bg-slate-100" />
                <SkeletonBlock className="w-full h-9 bg-slate-100" />
                <SkeletonBlock className="w-1/2 h-9 bg-slate-100" />
            </div>
        </motion.div>
    );
};
