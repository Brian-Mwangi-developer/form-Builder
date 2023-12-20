import { GetFormStats, GetForms } from '@/actions/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode, Suspense } from "react";
import { LuVibrate, LuView } from "react-icons/lu";
import {FaEdit, FaWpforms} from "react-icons/fa";
import {HiCursorClick} from "react-icons/hi";
import {TbArrowBounce} from "react-icons/tb";
import { Separator } from '@/components/ui/separator';
import {CreateFormBtn} from '@/components/CreateFormBtn';
import { Form } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {BiRightArrowAlt} from "react-icons/bi";


export default function Home() {
  return (
    <div className='container pt-4'>
      <Suspense fallback={<StatsCards loading={true} />}>
      <CardStatsWrapper/>
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your Forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <CreateFormBtn />
        <Suspense fallback={[1,2,3,4].map(el => <FormCardSkeleton key={el}/>)}>
          <FormCards />
        </Suspense>
        </div>
      
      </div>
  )
}

 async function CardStatsWrapper(){
  const stats = await GetFormStats();
  return <StatsCards loading ={false} data ={stats} />;
}
interface StatsCardProps{ //used when you want to describe how an object should look while type is like giving a new name to something you've already made. 
  data?:Awaited<ReturnType<typeof GetFormStats>>;
  loading:boolean;
}
function StatsCards(props:StatsCardProps){

  const {data,loading} = props;

  return <div className='w-full pt-8 gap-4 grid grids-cols-1 md:grid-cols-2 lg:grid-cols-4'>
    <StatsCard title="Total Visits"
    icon ={<LuView className="text-blue-600" />} 
    helperText="All time Form submissions"
    value={data?.visits.toLocaleString( ) + "%" || ""}
    loading ={loading}
    className="Shadow-md shadow-blue-600"
    />
    <StatsCard title="Total Submission"
    icon ={<FaWpforms className="text-yellow-600" />} 
    helperText="Visits that result in form submission"
    value={data?.submissions.toLocaleString( ) + "%"|| ""}
    loading ={loading}
    className="Shadow-md shadow-yellow-600"
    />
    <StatsCard title="Submission rate"
    icon ={<HiCursorClick className="text-green-600" />} 
    helperText="All time Form visits"
    value={data?.submissionRate.toLocaleString( ) + "%" || ""}
    loading ={loading}
    className="Shadow-md shadow-green-600"
    />
    <StatsCard title="Bounce rate"
    icon ={<TbArrowBounce className="text-red-600" />} 
    helperText="Visits that leaves without interacting"
    value={data?.submissionRate.toLocaleString( ) + "%" || ""}
    loading ={loading}
    className="Shadow-md shadow-red-600"
    />
  </div>
};

function StatsCard({
title,
value,
icon,
helperText,
loading,
className
}:{title:string;
value:string;
helperText:string;
loading:boolean;
icon: ReactNode;
className:string;
}){
  return <Card className={className}>
    <CardHeader className='flex flex-row items-center justify-between pb-2'>
      <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-bold'>
        {loading && (<Skeleton>
          <span className='opacity-0'>0</span>
          </Skeleton>
        )
        }{!loading && value}
      </div>
      <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
    </CardContent>
  </Card>
}

function FormCardSkeleton(){
return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full"/>;
}

 async function FormCards(){
  const forms = await GetForms();
  return <>{forms.map(form =>(
    <FormCard key={form.id} form={form} />
  ))}</>
 }


function FormCard({form}:{form:Form}){
  return <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 justify-between">
        <span className="truncate font-bold" >{form.name}</span>
        {form.published && <Badge>{form.published}</Badge>}
        {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
      </CardTitle>
      <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
        {formatDistance(form.createdAt,new Date(), {
            addSuffix: true,
          })}
          {form.published && <span className="flex items-center gap-2">
            <LuView className="text-muted-foreground"/>
            <span>{form.visits.toLocaleString()}</span>
            <FaWpforms className="text-muted-foreground"/>
            <span>{form.submissions.toLocaleString()}</span>
            </span>}
      </CardDescription>
    </CardHeader>
    <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
      {form.description || "No description"}
    </CardContent>
    <CardFooter>
      {form.published && (
        <Button>
          <Link href={`/forms/${form.id}`}>View Submissions <BiRightArrowAlt /></Link>
        </Button>
      )}
      {!form.published && (
          <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
            <Link href={`/builder/${form.id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
    </CardFooter>
  </Card>
}