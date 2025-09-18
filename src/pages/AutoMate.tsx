import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Upload, 
  Sparkles, 
  MessageSquare,
  Camera,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Play,
  FileText,
  TrendingUp,
  Clipboard,
  Receipt,
  BarChart3,
  Settings,
  Send,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AutoMate = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{id: number, type: 'user' | 'ai', content: string, timestamp: Date}>>([
    {
      id: 1,
      type: 'ai',
      content: 'Welcome to AutoMate AI! I can help you manage your business operations through voice commands and image processing. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const quickActions = [
    {
      icon: Package,
      title: "Products",
      description: "Add, update, or manage inventory",
      action: "products"
    },
    {
      icon: Users,
      title: "Customers", 
      description: "Manage customer data and profiles",
      action: "customers"
    },
    {
      icon: ShoppingCart,
      title: "Sales",
      description: "Process sales and transactions",
      action: "sales"
    },
    {
      icon: Truck,
      title: "Suppliers",
      description: "Manage supplier relationships",
      action: "suppliers"
    },
    {
      icon: Clipboard,
      title: "Purchase Orders",
      description: "Create and manage purchase orders",
      action: "purchase-orders"
    },
    {
      icon: Receipt,
      title: "Orders",
      description: "View and process customer orders",
      action: "orders"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Generate reports and insights",
      action: "analytics"
    },
    {
      icon: BarChart3,
      title: "Finance",
      description: "Financial tracking and management",
      action: "finance"
    }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your automation request clearly",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing your voice command...",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast({
          title: "Image Uploaded",
          description: "Ready for AI processing",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: `I want to work with ${action.replace('-', ' ')}`,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai' as const,
        content: `Great! I'm ready to help you with ${action.replace('-', ' ')}. You can now use voice commands or upload images to process your ${action.replace('-', ' ')} operations. What specific task would you like me to help you with?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const processWithAI = async () => {
    if (!selectedAction) {
      toast({
        title: "Select an Action",
        description: "Please select what you'd like to work with first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Connecting to OpenAI...');
    
    const steps = [
      'Analyzing your input...',
      'Processing with AI models...',
      'Generating automation commands...',
      'Preparing database operations...',
      'Finalizing process...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    setProcessingStep('');
    setIsProcessing(false);
    
    const aiResponse = {
      id: messages.length + 1,
      type: 'ai' as const,
      content: `✅ Processing complete! I've analyzed your request for ${selectedAction.replace('-', ' ')} operations. The AI has generated the necessary commands and is ready to execute the automation.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiResponse]);
    
    toast({
      title: "AI Processing Complete",
      description: "Automation commands are ready for execution",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AutoMate AI Assistant</h1>
              <p className="text-muted-foreground">AI-powered business automation through voice and visual commands</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Sparkles className="h-4 w-4 mr-2" />
              OpenAI Integration
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Gemini Enhanced
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Select what you'd like to work with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant={selectedAction === action.action ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4 text-left"
                  onClick={() => handleActionSelect(action.action)}
                >
                  <div className="flex items-start gap-3">
                    <action.icon className="h-5 w-5 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Assistant Chat
              </CardTitle>
              <CardDescription>
                Interact with AI to automate your business processes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-muted/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {processingStep && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-lg p-3 animate-pulse">
                      <p className="text-sm text-muted-foreground">{processingStep}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Controls */}
              <div className="space-y-4">
                <Separator />
                
                {/* Voice and Image Controls */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice Command</label>
                    <div className="flex gap-2">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Record
                          </>
                        )}
                      </Button>
                      
                      {audioBlob && (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isRecording && (
                      <div className="flex justify-center space-x-1">
                        <div className="w-1 h-4 bg-destructive rounded animate-bounce"></div>
                        <div className="w-1 h-6 bg-destructive rounded animate-bounce delay-100"></div>
                        <div className="w-1 h-4 bg-destructive rounded animate-bounce delay-200"></div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    
                    {uploadedImage && (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded" 
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Badge className="absolute top-1 right-1 text-xs">Ready</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Process Button */}
                <Button
                  onClick={processWithAI}
                  disabled={isProcessing || (!audioBlob && !uploadedImage && !selectedAction)}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Process with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              AI System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">OpenAI Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Gemini Ready</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Backend Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoMate;