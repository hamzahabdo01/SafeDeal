import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Info,
  Mail,
  Phone,
  Calendar,
  Clock,
} from 'lucide-react';
import { useEscrows } from '../../hooks/useEscrows';
import { APP_CONFIG } from '../../utils/constants';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import type { CreateEscrowRequest } from '../../types';

const createEscrowSchema = z.object({
  seller_id: z.number().min(1, 'Seller ID is required'),
  seller_email: z.string().email('Please enter a valid email address'),
  seller_name: z.string().min(2, 'Seller name is required'),
  amount: z.number()
    .min(APP_CONFIG.MIN_ESCROW_AMOUNT, `Minimum amount is $${APP_CONFIG.MIN_ESCROW_AMOUNT}`)
    .max(APP_CONFIG.MAX_ESCROW_AMOUNT, `Maximum amount is $${APP_CONFIG.MAX_ESCROW_AMOUNT}`),
  currency: z.string().min(1, 'Currency is required'),
  conditions: z.string().min(10, 'Please provide detailed conditions (minimum 10 characters)'),
  title: z.string().min(5, 'Title is required (minimum 5 characters)'),
  description: z.string().min(20, 'Please provide a detailed description (minimum 20 characters)'),
  delivery_date: z.string().min(1, 'Expected delivery date is required'),
  category: z.string().min(1, 'Category is required'),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    amount: z.number().min(0.01, 'Milestone amount must be greater than 0'),
    description: z.string().optional(),
  })).optional(),
});

type CreateEscrowFormData = z.infer<typeof createEscrowSchema>;

const CreateEscrow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [milestones, setMilestones] = useState<Array<{ title: string; amount: number; description: string }>>([]);
  const { createEscrow, isCreating } = useEscrows();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<CreateEscrowFormData>({
    resolver: zodResolver(createEscrowSchema),
    defaultValues: {
      currency: APP_CONFIG.DEFAULT_CURRENCY,
      category: '',
    },
  });

  const watchedAmount = watch('amount');
  const watchedCurrency = watch('currency');

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Enter the basic details of your escrow',
      icon: Shield,
    },
    {
      id: 2,
      title: 'Seller Details',
      description: 'Provide seller information',
      icon: User,
    },
    {
      id: 3,
      title: 'Transaction Details',
      description: 'Set amount and conditions',
      icon: DollarSign,
    },
    {
      id: 4,
      title: 'Review & Create',
      description: 'Review and create your escrow',
      icon: CheckCircle,
    },
  ];

  const categories = [
    'Digital Services',
    'Physical Goods',
    'Software Development',
    'Design & Creative',
    'Consulting',
    'Real Estate',
    'Automotive',
    'Electronics',
    'Other',
  ];

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', amount: 0, description: '' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof CreateEscrowFormData)[] => {
    switch (step) {
      case 1:
        return ['title', 'description', 'category'];
      case 2:
        return ['seller_email', 'seller_name'];
      case 3:
        return ['amount', 'currency', 'conditions', 'delivery_date'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: CreateEscrowFormData) => {
    try {
      const escrowData: CreateEscrowRequest = {
        seller_id: data.seller_id || 1, // This would come from seller lookup
        amount: data.amount,
        conditions: data.conditions,
      };

      await createEscrow(escrowData);
      navigate('/escrows');
    } catch (error) {
      console.error('Failed to create escrow:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1 
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/escrows')}
              className="mb-4 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Escrows
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Escrow
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up a secure escrow transaction in just a few steps
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : isActive
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </motion.div>
                      <div className="mt-2 text-center">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-8">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Basic Information
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Start by providing the basic details of your escrow transaction.
                        </p>
                      </div>

                      <Input
                        {...register('title')}
                        label="Escrow Title"
                        placeholder="e.g., Website Development Project"
                        error={errors.title?.message}
                        required
                        leftIcon={<FileText />}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className="input-field resize-none"
                          placeholder="Provide a detailed description of what will be delivered..."
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register('category')}
                          className="input-field"
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Seller Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Seller Information
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Provide the seller's contact information for this transaction.
                        </p>
                      </div>

                      <Input
                        {...register('seller_name')}
                        label="Seller Name"
                        placeholder="Enter seller's full name"
                        error={errors.seller_name?.message}
                        required
                        leftIcon={<User />}
                      />

                      <Input
                        {...register('seller_email')}
                        type="email"
                        label="Seller Email"
                        placeholder="seller@example.com"
                        error={errors.seller_email?.message}
                        required
                        leftIcon={<Mail />}
                      />

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Seller Verification
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              The seller will receive an email invitation to join this escrow. 
                              They must verify their identity before the transaction can proceed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Transaction Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Transaction Details
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Set the amount and conditions for this escrow transaction.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          {...register('amount', { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          label="Escrow Amount"
                          placeholder="0.00"
                          error={errors.amount?.message}
                          required
                          leftIcon={<DollarSign />}
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Currency <span className="text-red-500">*</span>
                          </label>
                          <select
                            {...register('currency')}
                            className="input-field"
                          >
                            {APP_CONFIG.SUPPORTED_CURRENCIES.map(currency => (
                              <option key={currency} value={currency}>
                                {currency}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {watchedAmount && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                Total Amount: {watchedAmount} {watchedCurrency}
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                Platform fee: {(watchedAmount * 0.025).toFixed(2)} {watchedCurrency} (2.5%)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Input
                        {...register('delivery_date')}
                        type="date"
                        label="Expected Delivery Date"
                        error={errors.delivery_date?.message}
                        required
                        leftIcon={<Calendar />}
                        min={new Date().toISOString().split('T')[0]}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Conditions & Terms <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register('conditions')}
                          rows={6}
                          className="input-field resize-none"
                          placeholder="Describe the conditions that must be met for the funds to be released. Be as specific as possible..."
                        />
                        {errors.conditions && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.conditions.message}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Clear conditions help prevent disputes and ensure smooth transactions.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                          Review & Create Escrow
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Please review all details before creating your escrow.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Basic Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Title:</span> {watch('title')}</p>
                            <p><span className="text-gray-500">Category:</span> {watch('category')}</p>
                            <p><span className="text-gray-500">Description:</span> {watch('description')?.substring(0, 100)}...</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Seller Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Name:</span> {watch('seller_name')}</p>
                            <p><span className="text-gray-500">Email:</span> {watch('seller_email')}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Transaction Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Amount:</span> {watch('amount')} {watch('currency')}</p>
                            <p><span className="text-gray-500">Delivery Date:</span> {watch('delivery_date')}</p>
                            <p><span className="text-gray-500">Platform Fee:</span> {((watch('amount') || 0) * 0.025).toFixed(2)} {watch('currency')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                              Important Notice
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              Once created, this escrow cannot be cancelled without mutual agreement. 
                              Please ensure all details are correct before proceeding.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center"
            >
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="group"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Previous
                  </Button>
                )}
              </div>

              <div>
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="group"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    isLoading={isCreating}
                    disabled={isCreating}
                    className="px-8"
                  >
                    Create Escrow
                  </Button>
                )}
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEscrow;