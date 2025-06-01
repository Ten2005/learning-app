"use client";

import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface Feature {
  icon: string;
  title: string;
  desc: string;
  gradient: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  gradient: string;
  popular: boolean;
}

const FloatingParticle = ({ particle }: { particle: Particle }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const AnimatedText = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 100, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0, scale: 0.8 }}
      animate={
        isInView
          ? { y: 0, opacity: 1, scale: 1 }
          : { y: 60, opacity: 0, scale: 0.8 }
      }
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{
        y: -10,
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      className="group relative h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/30 cursor-pointer"
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 rounded-3xl`}
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="text-6xl mb-6"
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {feature.icon}
      </motion.div>

      <motion.h3
        className="text-2xl font-bold mb-4"
        whileHover={{ color: "#ffffff" }}
      >
        {feature.title}
      </motion.h3>

      <motion.p
        className="text-gray-400 leading-relaxed"
        whileHover={{ color: "#d1d5db" }}
      >
        {feature.desc}
      </motion.p>
    </motion.div>
  );
};

const PricingCard = ({ plan, index }: { plan: Plan; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 100, opacity: 0, rotateX: -15 }}
      animate={
        isInView
          ? {
              y: plan.popular ? -32 : 0,
              opacity: 1,
              rotateX: 0,
            }
          : {
              y: 100,
              opacity: 0,
              rotateX: -15,
            }
      }
      transition={{ duration: 0.8, delay: index * 0.2 }}
      whileHover={{
        scale: 1.05,
        y: plan.popular ? -40 : -8,
        transition: { duration: 0.3 },
      }}
      className="relative group"
    >
      <AnimatePresence>
        {plan.popular && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(255, 165, 0, 0.5)",
                  "0 0 30px rgba(255, 165, 0, 0.8)",
                  "0 0 20px rgba(255, 165, 0, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 rounded-full text-sm font-bold"
            >
              Most Popular
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`relative h-full bg-gradient-to-br ${plan.gradient} p-[2px] rounded-3xl`}
        whileHover={{
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        <motion.div
          className="h-full bg-gray-900 rounded-3xl p-8 relative overflow-hidden"
          whileHover={{ backgroundColor: "#1a1a1a" }}
        >
          <div className="relative z-10">
            <motion.h3
              className="text-2xl font-bold mb-4"
              whileHover={{ scale: 1.05 }}
            >
              {plan.name}
            </motion.h3>

            <motion.div className="mb-8" whileHover={{ scale: 1.1 }}>
              <span className="text-5xl font-black">{plan.price}</span>
              <span className="text-gray-400 ml-2">{plan.period}</span>
            </motion.div>

            <motion.ul className="space-y-4 mb-8">
              {plan.features.map((feature: string, idx: number) => (
                <motion.li
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={
                    isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }
                  }
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <span className="text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <Link href="/dashboard">
              <motion.button
                className={`w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r ${plan.gradient}`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {plan.name === "Explorer" ? "無料で開始" : "アップグレード"}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const generatedParticles: Particle[] = Array.from(
      { length: 30 },
      (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
      }),
    );
    setParticles(generatedParticles);
  }, []);

  const features = [
    {
      icon: "🧠",
      title: "自動学習設計",
      desc: "量子レベルでの学習分析により、あなたの脳波パターンに最適化されたカリキュラムを生成",
      gradient: "from-purple-600 via-purple-500 to-pink-500",
    },
    {
      icon: "⚡",
      title: "適応型テスト",
      desc: "リアルタイム認知負荷測定により、学習効率を最大化するテストを動的生成",
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
    },
    {
      icon: "📊",
      title: "進捗予測分析",
      desc: "機械学習アルゴリズムが未来の学習成果を予測し、最短経路を提案",
      gradient: "from-cyan-600 via-teal-500 to-green-500",
    },
  ];

  const plans = [
    {
      name: "Explorer",
      price: "¥0",
      period: "永続無料",
      features: ["基本AI分析", "月5回生成", "コミュニティサポート"],
      gradient: "from-gray-600 to-gray-700",
      popular: false,
    },
    {
      name: "Genius",
      price: "¥2,980",
      period: "/月",
      features: ["高度AI分析", "無制限生成", "個人コーチング", "予測分析"],
      gradient: "from-purple-600 to-blue-600",
      popular: true,
    },
    {
      name: "Visionary",
      price: "¥7,980",
      period: "/月",
      features: ["全機能解放", "チーム管理", "API連携", "専属サポート"],
      gradient: "from-orange-600 to-red-600",
      popular: false,
    },
  ];

  return (
    <div
      className={`${inter.className} min-h-screen bg-black text-white overflow-hidden relative`}
    >
      {/* Animated Background */}
      <motion.div className="fixed inset-0 z-0" style={{ y: y1, opacity }}>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Orbs */}
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-xl"
          animate={{
            x: [20, 100, 20],
            y: [80, 200, 80],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"
          animate={{
            x: [300, 200, 300],
            y: [160, 80, 160],
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Particle Grid */}
        <div className="absolute inset-0 opacity-30">
          {particles.map((particle) => (
            <FloatingParticle key={particle.id} particle={particle} />
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 container mx-auto px-6 py-8"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div className="relative">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.5)",
                    "0 0 30px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(6, 182, 212, 0.5)",
                    "0 0 30px rgba(147, 51, 234, 0.5)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-white font-bold text-lg">AI</span>
              </motion.div>
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              学習エージェント
            </motion.span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {["特徴", "仕組み", "料金"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-gray-300 hover:text-white transition-colors duration-300 group"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {item}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          <Link href="/dashboard">
            <motion.button
              className="relative group px-8 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-full font-semibold overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span className="relative z-10">今すぐ始める</motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-40 container mx-auto px-6 py-20 text-center"
        style={{ y: y2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-8">
            <motion.h1
              className="text-7xl md:text-8xl font-black leading-tight"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <AnimatedText delay={0.2}>
                <motion.span
                  className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  AI が創る
                </motion.span>
              </AnimatedText>
              <br />
              <AnimatedText delay={0.4}>
                <motion.span
                  className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  未来の学習
                </motion.span>
              </AnimatedText>
            </motion.h1>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 border border-purple-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-24 h-24 border border-cyan-500/30 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <AnimatedText delay={0.6}>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="font-light">あらゆる知識領域で、</span>
              <motion.span
                className="font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                AIエージェント
              </motion.span>
              <span className="font-light">が設計する</span>
              <br />
              <span className="font-light">完全パーソナライズ学習体験</span>
            </motion.p>
          </AnimatedText>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl text-xl font-bold overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span className="relative z-10 flex items-center space-x-3">
                  <span>学習を革新する</span>
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </motion.span>
              </motion.button>
            </Link>

            <motion.button
              className="group px-12 py-5 border-2 border-gray-500 rounded-2xl text-xl font-bold backdrop-blur-sm"
              whileHover={{
                borderColor: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-3">
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5H9m0-5H7.5A1.5 1.5 0 006 11.5v1A1.5 1.5 0 007.5 14H9"
                  />
                </motion.svg>
                <span>マジックを体験</span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-40 py-32">
        <div className="container mx-auto px-6">
          <AnimatedText delay={0}>
            <div className="text-center mb-20">
              <motion.h2
                className="text-5xl font-black mb-6"
                whileInView={{ scale: [0.8, 1.02, 1] }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  革新的機能
                </span>
              </motion.h2>
              <p className="text-xl text-gray-400">
                AI が実現する次世代学習エクスペリエンス
              </p>
            </div>
          </AnimatedText>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-40 py-32">
        <div className="container mx-auto px-6">
          <AnimatedText delay={0}>
            <div className="text-center mb-20">
              <motion.h2
                className="text-5xl font-black mb-6"
                whileInView={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span
                  className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
                  style={{ backgroundSize: "200% 200%" }}
                >
                  未来への投資
                </span>
              </motion.h2>
              <p className="text-xl text-gray-400">
                あなたの可能性を解放するプラン
              </p>
            </div>
          </AnimatedText>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        className="relative z-40 py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="relative max-w-4xl mx-auto">
            <AnimatedText delay={0}>
              <motion.h2
                className="text-6xl font-black mb-8"
                whileInView={{
                  scale: [1, 1.02, 1],
                  textShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.5)",
                    "0 0 40px rgba(147, 51, 234, 0.8)",
                    "0 0 20px rgba(147, 51, 234, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  未来は今、始まる
                </span>
              </motion.h2>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
                一歩踏み出すだけで、あなたの学習体験は完全に変革される
              </p>
            </AnimatedText>

            <Link href="/dashboard">
              <motion.button
                className="group relative px-16 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full text-2xl font-bold overflow-hidden"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 50px rgba(147, 51, 234, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              >
                <motion.span className="relative z-10 flex items-center space-x-4">
                  <span>革命を始める</span>
                  <motion.svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 10, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </motion.span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
