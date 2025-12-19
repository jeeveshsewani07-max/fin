import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  Plus, 
  ShoppingCart, 
  CheckSquare, 
  Trash2, 
  Edit3, 
  Mic, 
  Share, 
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  Lightbulb,
  Filter,
  SortDesc,
  Users,
  Star,
  Sparkles,
  Brain,
  Store,
  Timer,
  Bell,
  Volume2
} from 'lucide-react';
import { toast } from 'sonner';

interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'household';
  completed: boolean;
  addedDate: Date;
  notes?: string;
  estimatedPrice?: number;
  priority: 'high' | 'medium' | 'low';
}

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  category: 'personal' | 'family' | 'work' | 'health';
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  completed: boolean;
  createdDate: Date;
  voiceNote?: string;
  tags: string[];
}

export function RemindersPage() {
  const { settings, t } = useApp();
  
  // State for groceries
  const [groceries, setGroceries] = useState<GroceryItem[]>([
    {
      id: '1',
      name: 'Milk',
      quantity: '2 liters',
      category: 'dairy',
      completed: false,
      addedDate: new Date(),
      priority: 'high',
      estimatedPrice: 120
    },
    {
      id: '2',
      name: 'Tomatoes',
      quantity: '1 kg',
      category: 'produce',
      completed: true,
      addedDate: new Date(Date.now() - 86400000),
      priority: 'medium',
      estimatedPrice: 60
    },
    {
      id: '3',
      name: 'Rice',
      quantity: '5 kg',
      category: 'pantry',
      completed: false,
      addedDate: new Date(),
      priority: 'high',
      estimatedPrice: 300
    }
  ]);

  // State for todos
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Doctor Appointment',
      description: 'Regular checkup with Dr. Sharma',
      category: 'health',
      priority: 'high',
      dueDate: new Date(Date.now() + 172800000), // 2 days from now
      completed: false,
      createdDate: new Date(),
      tags: ['health', 'appointment']
    },
    {
      id: '2',
      title: 'Call Priya',
      description: 'Discuss weekend plans',
      category: 'family',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      completed: false,
      createdDate: new Date(),
      tags: ['family', 'call']
    },
    {
      id: '3',
      title: 'Pay electricity bill',
      description: 'Due on 15th',
      category: 'personal',
      priority: 'high',
      completed: true,
      createdDate: new Date(Date.now() - 86400000),
      tags: ['bills', 'urgent']
    }
  ]);

  // Dialog states
  const [showAddGrocery, setShowAddGrocery] = useState(false);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Filter and sort states
  const [groceryFilter, setGroceryFilter] = useState('all');
  const [todoFilter, setTodoFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Form states
  const [groceryForm, setGroceryForm] = useState({
    name: '',
    quantity: '',
    category: 'produce' as GroceryItem['category'],
    priority: 'medium' as GroceryItem['priority'],
    notes: ''
  });

  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    category: 'personal' as TodoItem['category'],
    priority: 'medium' as TodoItem['priority'],
    dueDate: undefined as Date | undefined,
    tags: [] as string[]
  });

  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Smart suggestions based on patterns
  const getSmartSuggestions = () => {
    const suggestions = [
      { type: 'grocery', item: 'Bread', reason: 'Usually buy weekly' },
      { type: 'grocery', item: 'Bananas', reason: 'Healthy snack' },
      { type: 'grocery', item: 'Yogurt', reason: 'Often paired with fruits' },
      { type: 'todo', item: 'Water plants', reason: 'Weekly routine' },
      { type: 'todo', item: 'Check blood pressure', reason: 'Health monitoring' }
    ];
    return suggestions;
  };

  // Calculate completion progress
  const groceryProgress = groceries.length ? (groceries.filter(g => g.completed).length / groceries.length) * 100 : 0;
  const todoProgress = todos.length ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0;

  // Category colors and icons
  const categoryColors = {
    produce: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    dairy: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    meat: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    pantry: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    household: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    personal: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    family: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    work: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    health: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
  };

  // Add grocery item
  const handleAddGrocery = () => {
    if (!groceryForm.name.trim()) {
      toast.error(settings.language === 'hindi' ? 'कृपया आइटम का नाम दर्ज करें' : 'Please enter item name');
      return;
    }

    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: groceryForm.name,
      quantity: groceryForm.quantity || '1',
      category: groceryForm.category,
      priority: groceryForm.priority,
      completed: false,
      addedDate: new Date(),
      notes: groceryForm.notes
    };

    setGroceries(prev => [...prev, newItem]);
    setGroceryForm({ name: '', quantity: '', category: 'produce', priority: 'medium', notes: '' });
    setShowAddGrocery(false);
    toast.success(settings.language === 'hindi' ? 'आइटम जोड़ा गया' : 'Item added successfully');
  };

  // Add todo item
  const handleAddTodo = () => {
    if (!todoForm.title.trim()) {
      toast.error(settings.language === 'hindi' ? 'कृपया कार्य का शीर्षक दर्ज करें' : 'Please enter task title');
      return;
    }

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: todoForm.title,
      description: todoForm.description,
      category: todoForm.category,
      priority: todoForm.priority,
      dueDate: todoForm.dueDate,
      completed: false,
      createdDate: new Date(),
      tags: todoForm.tags
    };

    setTodos(prev => [...prev, newTodo]);
    setTodoForm({ 
      title: '', 
      description: '', 
      category: 'personal', 
      priority: 'medium', 
      dueDate: undefined, 
      tags: [] 
    });
    setShowAddTodo(false);
    toast.success(settings.language === 'hindi' ? 'कार्य जोड़ा गया' : 'Task added successfully');
  };

  // Toggle completion
  const toggleGroceryComplete = (id: string) => {
    setGroceries(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const toggleTodoComplete = (id: string) => {
    setTodos(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Delete items
  const deleteGrocery = (id: string) => {
    setGroceries(prev => prev.filter(item => item.id !== id));
    toast.success(settings.language === 'hindi' ? 'आइटम हटाया गया' : 'Item deleted');
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(item => item.id !== id));
    toast.success(settings.language === 'hindi' ? 'कार्य हटाया गया' : 'Task deleted');
  };

  // Filter functions
  const filteredGroceries = groceries.filter(item => {
    if (groceryFilter === 'all') return true;
    if (groceryFilter === 'completed') return item.completed;
    if (groceryFilter === 'pending') return !item.completed;
    return item.category === groceryFilter;
  });

  const filteredTodos = todos.filter(item => {
    if (todoFilter === 'all') return true;
    if (todoFilter === 'completed') return item.completed;
    if (todoFilter === 'pending') return !item.completed;
    return item.category === todoFilter;
  });

  // Voice recording simulation
  const handleVoiceRecord = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      toast.success(settings.language === 'hindi' ? 'वॉइस नोट रिकॉर्ड किया गया' : 'Voice note recorded');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="module-reminders">{t.remindersTasks}</h1>
          <p className="text-muted-foreground mt-2">
            {settings.language === 'hindi' 
              ? 'अपनी किराना सूची और दैनिक कार्यों को व्यवस्थित करें'
              : 'Organize your grocery list and daily tasks'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSmartSuggestions(true)}
            className="hidden md:flex"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t.smartSuggestions}
          </Button>
          <Button variant="outline" onClick={handleVoiceRecord}>
            <Mic className={`w-4 h-4 mr-2 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
            {t.voiceNote}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              {t.groceriesList}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{groceries.filter(g => g.completed).length} / {groceries.length} {t.completed}</span>
                <span>{Math.round(groceryProgress)}%</span>
              </div>
              <Progress value={groceryProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              {t.todoList}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{todos.filter(t => t.completed).length} / {todos.length} {t.completed}</span>
                <span>{Math.round(todoProgress)}%</span>
              </div>
              <Progress value={todoProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="groceries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groceries" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {t.groceriesList}
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            {t.todoList}
          </TabsTrigger>
        </TabsList>

        {/* Groceries Tab */}
        <TabsContent value="groceries" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 module-reminders" />
                  {t.groceriesList}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={groceryFilter} onValueChange={setGroceryFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.all}</SelectItem>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                      <SelectItem value="completed">{t.completed}</SelectItem>
                      <SelectItem value="produce">{t.produce}</SelectItem>
                      <SelectItem value="dairy">{t.dairy}</SelectItem>
                      <SelectItem value="meat">{t.meat}</SelectItem>
                      <SelectItem value="pantry">{t.pantry}</SelectItem>
                      <SelectItem value="household">{t.household}</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showAddGrocery} onOpenChange={setShowAddGrocery}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {t.addGrocery}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t.addGrocery}</DialogTitle>
                        <DialogDescription>
                          {settings.language === 'hindi' 
                            ? 'अपनी किराना सूची में नया आइटम जोड़ें'
                            : 'Add a new item to your grocery list'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="item-name">{t.itemName}</Label>
                          <Input
                            id="item-name"
                            value={groceryForm.name}
                            onChange={(e) => setGroceryForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder={settings.language === 'hindi' ? 'जैसे: दूध, चावल' : 'e.g., Milk, Rice'}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="quantity">{t.quantity}</Label>
                          <Input
                            id="quantity"
                            value={groceryForm.quantity}
                            onChange={(e) => setGroceryForm(prev => ({ ...prev, quantity: e.target.value }))}
                            placeholder={settings.language === 'hindi' ? '1 किलो, 2 लीटर' : '1 kg, 2 liters'}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{t.category}</Label>
                            <Select value={groceryForm.category} onValueChange={(value: GroceryItem['category']) => 
                              setGroceryForm(prev => ({ ...prev, category: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="produce">{t.produce}</SelectItem>
                                <SelectItem value="dairy">{t.dairy}</SelectItem>
                                <SelectItem value="meat">{t.meat}</SelectItem>
                                <SelectItem value="pantry">{t.pantry}</SelectItem>
                                <SelectItem value="household">{t.household}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>{t.priority}</Label>
                            <Select value={groceryForm.priority} onValueChange={(value: GroceryItem['priority']) => 
                              setGroceryForm(prev => ({ ...prev, priority: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">{t.high}</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">{t.low}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={groceryForm.notes}
                            onChange={(e) => setGroceryForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder={settings.language === 'hindi' ? 'अतिरिक्त जानकारी...' : 'Additional notes...'}
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddGrocery(false)}>
                            {t.cancel}
                          </Button>
                          <Button onClick={handleAddGrocery}>
                            {t.addItem}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredGroceries.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        item.completed ? 'bg-muted/50 opacity-75' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleGroceryComplete(item.id)}
                          />
                          <div className="flex-1">
                            <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{item.quantity}</p>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={categoryColors[item.category]}>
                            {t[item.category]}
                          </Badge>
                          <Badge variant="outline" className={priorityColors[item.priority]}>
                            {item.priority === 'high' ? t.high : item.priority === 'low' ? t.low : 'Medium'}
                          </Badge>
                          {item.estimatedPrice && (
                            <Badge variant="secondary">
                              ₹{item.estimatedPrice}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGrocery(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredGroceries.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {settings.language === 'hindi' 
                          ? 'कोई आइटम नहीं मिला' 
                          : 'No items found'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Todos Tab */}
        <TabsContent value="todos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 module-reminders" />
                  {t.todoList}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={todoFilter} onValueChange={setTodoFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.all}</SelectItem>
                      <SelectItem value="pending">{t.pending}</SelectItem>
                      <SelectItem value="completed">{t.completed}</SelectItem>
                      <SelectItem value="personal">{t.personal}</SelectItem>
                      <SelectItem value="family">{t.family}</SelectItem>
                      <SelectItem value="work">{t.work}</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showAddTodo} onOpenChange={setShowAddTodo}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {t.addTodo}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{t.addTodo}</DialogTitle>
                        <DialogDescription>
                          {settings.language === 'hindi' 
                            ? 'अपनी कार्य सूची में नया कार्य जोड़ें'
                            : 'Add a new task to your to-do list'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="todo-title">Title</Label>
                          <Input
                            id="todo-title"
                            value={todoForm.title}
                            onChange={(e) => setTodoForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder={settings.language === 'hindi' ? 'कार्य का शीर्षक' : 'Task title'}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="todo-description">Description</Label>
                          <Textarea
                            id="todo-description"
                            value={todoForm.description}
                            onChange={(e) => setTodoForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={settings.language === 'hindi' ? 'कार्य का विवरण...' : 'Task description...'}
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{t.category}</Label>
                            <Select value={todoForm.category} onValueChange={(value: TodoItem['category']) => 
                              setTodoForm(prev => ({ ...prev, category: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="personal">{t.personal}</SelectItem>
                                <SelectItem value="family">{t.family}</SelectItem>
                                <SelectItem value="work">{t.work}</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>{t.priority}</Label>
                            <Select value={todoForm.priority} onValueChange={(value: TodoItem['priority']) => 
                              setTodoForm(prev => ({ ...prev, priority: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">{t.high}</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">{t.low}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>{t.dueDate}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {todoForm.dueDate ? todoForm.dueDate.toLocaleDateString() : 'Select date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={todoForm.dueDate}
                                onSelect={(date) => setTodoForm(prev => ({ ...prev, dueDate: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddTodo(false)}>
                            {t.cancel}
                          </Button>
                          <Button onClick={handleAddTodo}>
                            {t.addItem}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredTodos.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        item.completed ? 'bg-muted/50 opacity-75' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleTodoComplete(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            )}
                            {item.dueDate && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {item.dueDate.toLocaleDateString()}
                              </div>
                            )}
                            {item.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {item.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={categoryColors[item.category]}>
                            {t[item.category] || item.category}
                          </Badge>
                          <Badge variant="outline" className={priorityColors[item.priority]}>
                            {item.priority === 'high' ? t.high : item.priority === 'low' ? t.low : 'Medium'}
                          </Badge>
                          {item.dueDate && new Date() > item.dueDate && !item.completed && (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTodos.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {settings.language === 'hindi' 
                          ? 'कोई कार्य नहीं मिला' 
                          : 'No tasks found'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Smart Suggestions Dialog */}
      <Dialog open={showSmartSuggestions} onOpenChange={setShowSmartSuggestions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {t.smartSuggestions}
            </DialogTitle>
            <DialogDescription>
              {settings.language === 'hindi' 
                ? 'आपके पैटर्न के आधार पर सुझाव'
                : 'Suggestions based on your patterns'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {getSmartSuggestions().map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {suggestion.type === 'grocery' ? (
                    <ShoppingCart className="w-4 h-4 text-green-600" />
                  ) : (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">{suggestion.item}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Action Buttons */}
      <div className="fixed bottom-20 right-20 flex flex-col gap-2 z-30">
        <Button
          size="icon"
          className="rounded-full shadow-lg animate-bounce"
          onClick={() => setShowAddGrocery(true)}
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full shadow-lg"
          onClick={() => setShowAddTodo(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}