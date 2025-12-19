import React, { useState } from 'react';
import { Users, MessageCircle, Camera, Mic, Heart, Leaf, Music, BookOpen, Coffee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface SocialGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  icon: React.ReactNode;
  isJoined: boolean;
  recentActivity: string;
  activeMembers: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  type: 'text' | 'photo' | 'voice';
}

export function CommunityPage() {
  const { t } = useApp();
  
  const [groups, setGroups] = useState<SocialGroup[]>([
    {
      id: '1',
      name: 'Gardening Club',
      description: 'Share gardening tips, seasonal planting advice, and showcase your beautiful gardens.',
      memberCount: 124,
      category: 'Hobbies',
      icon: <Leaf size={24} className="text-green-500" />,
      isJoined: true,
      recentActivity: '2 hours ago',
      activeMembers: ['Priya S.', 'Rajesh K.', 'Meera P.']
    },
    {
      id: '2',
      name: 'Walking Buddies',
      description: 'Find walking partners in your area and join group walks for fitness and friendship.',
      memberCount: 89,
      category: 'Fitness',
      icon: <Heart size={24} className="text-red-500" />,
      isJoined: true,
      recentActivity: '1 hour ago',
      activeMembers: ['Amit R.', 'Sunita D.', 'Ravi M.', 'Kavita N.']
    },
    {
      id: '3',
      name: 'Devotional Songs',
      description: 'Share and listen to devotional music, bhajans, and spiritual discussions.',
      memberCount: 156,
      category: 'Spiritual',
      icon: <Music size={24} className="text-purple-500" />,
      isJoined: false,
      recentActivity: '30 minutes ago',
      activeMembers: ['Lakshmi V.', 'Gopal S.', 'Radha K.']
    },
    {
      id: '4',
      name: 'Grandparents Story Circle',
      description: 'Share stories with grandchildren and connect with other grandparents.',
      memberCount: 201,
      category: 'Family',
      icon: <BookOpen size={24} className="text-blue-500" />,
      isJoined: false,
      recentActivity: '45 minutes ago',
      activeMembers: ['Nirmala G.', 'Subhash C.', 'Kamala J.']
    },
    {
      id: '5',
      name: 'Tea & Coffee Conversations',
      description: 'Virtual tea time chats about daily life, current events, and friendly discussions.',
      memberCount: 78,
      category: 'Social',
      icon: <Coffee size={24} className="text-orange-500" />,
      isJoined: true,
      recentActivity: '15 minutes ago',
      activeMembers: ['Shanti L.', 'Brijesh P.', 'Usha T.']
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<SocialGroup | null>(groups.find(g => g.isJoined) || null);
  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Priya S.',
      message: 'Good morning everyone! My tomatoes are finally ripening. So excited to share them with neighbors.',
      time: '9:15 AM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'Rajesh K.',
      message: 'That\'s wonderful Priya! I\'d love to know your secret for such healthy tomatoes.',
      time: '9:18 AM',
      type: 'text'
    },
    {
      id: '3',
      sender: 'Meera P.',
      message: 'Shared a photo of my rose garden',
      time: '9:22 AM',
      type: 'photo'
    },
    {
      id: '4',
      sender: 'You',
      message: 'Beautiful roses Meera! The red ones are especially vibrant.',
      time: '9:25 AM',
      type: 'text'
    }
  ]);

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: !group.isJoined, memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 }
        : group
    ));
    
    const group = groups.find(g => g.id === groupId);
    if (group?.isJoined) {
      toast.success(`Left ${group.name}`);
    } else {
      toast.success(`Joined ${group?.name}`);
    }
  };

  const joinedGroups = groups.filter(group => group.isJoined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{t.community}</h1>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
          <p>Reference layout inspired by Khyaal's community and hobby groups for seniors</p>
        </div>
      </div>

      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups">{t.socialGroups}</TabsTrigger>
          <TabsTrigger value="chat">{t.groupChat}</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {group.icon}
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {group.category}
                      </Badge>
                    </div>
                  </div>
                  {group.isJoined && (
                    <Badge variant="default" className="bg-green-500">
                      Joined
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {group.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    {group.memberCount} {t.members}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Active {group.recentActivity}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {group.activeMembers.slice(0, 3).map((member, index) => (
                      <Avatar key={index} className="w-8 h-8 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {member.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.activeMembers.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{group.activeMembers.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => handleJoinGroup(group.id)}
                  variant={group.isJoined ? "outline" : "default"}
                  className="w-full"
                >
                  {group.isJoined ? 'Leave Group' : t.joinGroup}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Group Selection Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">My Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {joinedGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedGroup?.id === group.id 
                          ? 'bg-primary/20 border border-primary' 
                          : 'bg-accent/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {group.icon}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.memberCount} {t.members}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              {selectedGroup ? (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="flex-shrink-0 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedGroup.icon}
                        <div>
                          <CardTitle className="text-lg">{selectedGroup.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {selectedGroup.memberCount} {t.members} • {selectedGroup.activeMembers.length} online
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex gap-3 ${message.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {message.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 ${message.sender === 'You' ? 'text-right' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                            <div className={`inline-block p-3 rounded-lg max-w-xs ${
                              message.sender === 'You' 
                                ? 'bg-primary text-primary-foreground ml-auto' 
                                : 'bg-accent'
                            }`}>
                              {message.type === 'photo' ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <Camera size={16} />
                                  {message.message}
                                </div>
                              ) : (
                                <p className="text-sm">{message.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="flex-shrink-0 border-t p-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Camera size={16} className="mr-2" />
                        {t.sharePhoto}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mic size={16} className="mr-2" />
                        {t.startVoiceChat}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle size={16} className="mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg mb-2">Select a Group</h3>
                    <p className="text-muted-foreground">
                      Choose a group from the sidebar to start chatting
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}