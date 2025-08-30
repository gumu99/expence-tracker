import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Gift, Lock, CheckCircle } from "lucide-react";
import { Reward } from "@/types";

interface RewardsSystemProps {
  rewards: Reward[];
  userPoints: number;
}

export const RewardsSystem = ({ rewards, userPoints }: RewardsSystemProps) => {
  const unlockedRewards = rewards.filter(r => r.isUnlocked);
  const lockedRewards = rewards.filter(r => !r.isUnlocked);
  const nextReward = lockedRewards[0];

  return (
    <div className="space-y-4">
      {/* Points Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Reward Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">
              {userPoints}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Points Earned
            </div>
            {nextReward && (
              <div className="text-xs text-muted-foreground">
                {nextReward.pointsRequired - userPoints} points until next reward
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Reward Progress */}
      {nextReward && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-500" />
              Next Reward
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{nextReward.title}</span>
              <Badge variant="outline">{nextReward.pointsRequired} pts</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {nextReward.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{Math.min((userPoints / nextReward.pointsRequired) * 100, 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={Math.min((userPoints / nextReward.pointsRequired) * 100, 100)} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlocked Rewards */}
      {unlockedRewards.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Unlocked Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unlockedRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">{reward.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Unlocked {reward.unlockedAt && new Date(reward.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {reward.pointsRequired} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Rewards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lockedRewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{reward.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {reward.description}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">
                  {reward.pointsRequired} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
