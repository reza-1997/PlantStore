import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollAnimateProps {
    children: ReactNode
}

const ScrollAnimate = ({ children }: ScrollAnimateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }} // حالت اولیه: مخفی و ۵۰ پیکسل پایین‌تر
            whileInView={{ opacity: 1, y: 0 }} // حالتی که وارد صفحه می‌شود
            viewport={{ once: true, margin: "-50px" }} // فقط یک‌بار انیمیشن اجرا شود و کمی قبل از رسیدن اسکرول شروع شود
            transition={{ duration: 1, ease: "easeOut" }} // مدت زمان و نرمی حرکت
            style={{ width: "100%" }}>

            {children}

        </motion.div >
    );
};

export default ScrollAnimate;