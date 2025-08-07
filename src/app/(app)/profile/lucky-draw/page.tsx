
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings, LuckyDrawPrize } from '@/hooks/use-settings';
import { useLuckyDraw } from '@/hooks/use-lucky-draw';
import { useUserStats } from '@/hooks/use-user-stats';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { ChevronLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Wheel = ({ prizes, onSpinEnd }: { prizes: LuckyDrawPrize[], onSpinEnd: (prize: LuckyDrawPrize) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const numSegments = prizes.length || 10;
        const arcSize = (2 * Math.PI) / numSegments;
        const radius = canvas.width / 2 - 10;
        
        const colors = ["#FFC107", "#FF9800", "#FF5722", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#00BCD4", "#4CAF50"];

        const drawSegment = (index: number) => {
            ctx.beginPath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.moveTo(radius + 10, radius + 10);
            ctx.arc(radius + 10, radius + 10, radius, index * arcSize, (index + 1) * arcSize);
            ctx.lineTo(radius + 10, radius + 10);
            ctx.fill();
            
            // Draw text
            ctx.save();
            ctx.translate(radius + 10, radius + 10);
            ctx.rotate(index * arcSize + arcSize / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(prizes[index]?.name || "Prize", radius - 15, 5);
            ctx.restore();
        };

        for (let i = 0; i < numSegments; i++) {
            drawSegment(i);
        }
    }, [prizes]);

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const spinAngleStart = Math.random() * 10 + 10;
        const spinTimeTotal = (Math.random() * 3 + 4) * 1000;
        let spinAngle = 0;
        let start = new Date().getTime();
        
        const rotate = () => {
            const now = new Date().getTime();
            const timePassed = now - start;
            const progress = timePassed / spinTimeTotal;
            
            if (progress >= 1) {
                const degrees = (spinAngle * 180 / Math.PI) % 360;
                const arcSizeDegrees = 360 / prizes.length;
                const winningSegmentIndex = Math.floor((360 - degrees) / arcSizeDegrees);
                onSpinEnd(prizes[winningSegmentIndex]);
                setIsSpinning(false);
                return;
            }

            spinAngle = spinAngleStart * (1 - easeOut(progress));
            canvas.style.transform = `rotate(${spinAngle}rad)`;
            requestAnimationFrame(rotate);
        };
        
        rotate();
    };

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    return { spin, isSpinning, wheelCanvas: <canvas ref={canvasRef} width="300" height="300"></canvas> };
};

export default function LuckyDrawPage() {
    const { settings } = useSettings();
    const { spins, useSpin } = useLuckyDraw();
    const { addEarning } = useUserStats();
    const { toast } = useToast();
    const [lastPrize, setLastPrize] = useState<LuckyDrawPrize | null>(null);
    const [showResultDialog, setShowResultDialog] = useState(false);
    
    const handleSpinEnd = (prize: LuckyDrawPrize) => {
        setLastPrize(prize);
        setShowResultDialog(true);
        if (prize.amount > 0) {
            addEarning(prize.amount);
            toast({
                title: 'Congratulations!',
                description: `You won ${formatCurrency(prize.amount, 'BDT')}!`,
            });
        }
    };

    const { spin, isSpinning, wheelCanvas } = Wheel({ prizes: settings.luckyDrawPrizes, onSpinEnd: handleSpinEnd });

    const handleSpinClick = () => {
        if (spins > 0) {
            useSpin();
            spin();
        } else {
            toast({
                title: 'No Spins Left',
                description: 'You need to invest in eligible plans to get more spins.',
                variant: 'destructive',
            });
        }
    };
    
    if (!settings.luckyDrawEnabled) {
        return (
            <div className="container py-6 text-center">
                 <Button variant="ghost" asChild className="mb-4 absolute left-4 top-4">
                    <Link href="/profile">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                    </Link>
                </Button>
                <Card className="mt-16">
                    <CardHeader>
                        <CardTitle>Lucky Draw Unavailable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The lucky draw feature is currently disabled by the administrator.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
        <div className="container py-6 space-y-8">
             <Button variant="ghost" asChild className="mb-4 -ml-4">
                <Link href="/profile">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
                </Link>
            </Button>
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Lucky Draw</CardTitle>
                    <CardDescription>Spin the wheel to win exciting prizes!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    <div className="relative">
                        {wheelCanvas}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-4 border-primary"></div>
                         <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: '15px solid transparent',
                                borderRight: '15px solid transparent',
                                borderTop: '20px solid red',
                            }}
                        />
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                        <div className="flex items-center text-lg font-semibold bg-muted px-4 py-2 rounded-full">
                            <Ticket className="w-6 h-6 mr-2 text-primary" />
                            <span>Your Spins: {spins}</span>
                        </div>
                        <Button
                            size="lg"
                            className="w-full text-lg font-bold py-6"
                            onClick={handleSpinClick}
                            disabled={isSpinning || spins === 0}
                        >
                            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        {lastPrize && (
            <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{lastPrize.amount > 0 ? 'Congratulations!' : 'Better Luck Next Time!'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        You have won: <span className="font-bold text-primary">{lastPrize.name}</span>
                        {lastPrize.amount > 0 && ` (${formatCurrency(lastPrize.amount, "BDT")})`}. 
                        The prize has been added to your balance.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setShowResultDialog(false)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </>
    );
}
